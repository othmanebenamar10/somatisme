import { randomUUID } from 'node:crypto';
import nodemailer, { type Transporter } from 'nodemailer';
import { getProductById } from './_lib/products.js';
import { escapeHtml, getRedis, sanitizePlainText } from './_lib/security.js';
import { calculateOrderTotals } from './_lib/pricing.js';

export interface PaidOrder {
  sessionId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  company: string;
  address: string;
  message: string;
  items: Array<{ productId: string; quantity: number }>;
}

let transporter: Transporter | undefined;
function getTransporter(): Transporter {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials are not configured');
  }
  if (!transporter) {
    const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      pool: true,
      maxConnections: 2,
      maxMessages: 100,
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 15_000,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const releaseClaimScript = `
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  end
  return 0
`;

const localOrderEmailStates = new Map<string, { state: 'processing' | 'sent'; token?: string; expiresAt: number }>();

/** Called only after Stripe has verified a checkout.session.completed event. */
export async function sendPaidOrderEmails(order: PaidOrder): Promise<'sent' | 'already-sent' | 'busy'> {
  const key = `somatisme:order:${order.sessionId}`;
  const claimToken = randomUUID();
  let redis: ReturnType<typeof getRedis> | undefined;
  try {
    redis = getRedis();
  } catch {
    // Upstash is optional. Keep webhook email delivery functional with a per-instance guard.
  }

  if (redis) {
    const claimed = await redis.set(key, `processing:${claimToken}`, { nx: true, ex: 300 });
    if (!claimed) {
      const current = await redis.get<string>(key);
      return current === 'sent' ? 'already-sent' : 'busy';
    }
  } else {
    const now = Date.now();
    for (const [orderKey, state] of localOrderEmailStates) {
      if (state.expiresAt <= now) localOrderEmailStates.delete(orderKey);
    }
    const existing = localOrderEmailStates.get(key);
    if (existing) return existing.state === 'sent' ? 'already-sent' : 'busy';
    if (localOrderEmailStates.size >= 10_000) {
      const oldestKey = localOrderEmailStates.keys().next().value;
      if (oldestKey) localOrderEmailStates.delete(oldestKey);
    }
    localOrderEmailStates.set(key, { state: 'processing', token: claimToken, expiresAt: now + 5 * 60_000 });
  }

  try {
    const email = sanitizePlainText(order.customerEmail, 254).toLowerCase();
    const name = sanitizePlainText(order.customerName, 100) || 'Client';
    const items = order.items.map(({ productId, quantity }) => {
      const product = getProductById(productId);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
        throw new Error(`Invalid catalog item on paid Stripe order: ${productId}`);
      }
      return { name: product.name, price: product.price, quantity };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totals = calculateOrderTotals(subtotal);
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(sanitizePlainText(order.customerPhone, 24)),
      company: escapeHtml(sanitizePlainText(order.company, 150)),
      address: escapeHtml(sanitizePlainText(order.address, 200)),
      message: escapeHtml(sanitizePlainText(order.message, 500)),
      sessionId: escapeHtml(order.sessionId),
    };
    const itemsHtml = items.map((item) => `
      <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.name)}</td>
      <td style="padding:10px;text-align:center;border-bottom:1px solid #e2e8f0">${item.quantity}</td>
      <td style="padding:10px;text-align:right;border-bottom:1px solid #e2e8f0">${item.price * item.quantity} MAD</td></tr>`).join('');
    const html = `<!doctype html><html lang="fr"><body style="font-family:Arial,sans-serif;color:#1e293b">
      <h1>Confirmation de paiement SOMATISME</h1>
      <p>Bonjour ${safe.name}, votre paiement a été confirmé. Référence : ${safe.sessionId}</p>
      <table style="border-collapse:collapse;width:100%"><thead><tr><th align="left">Produit</th><th>Qté</th><th align="right">Montant</th></tr></thead><tbody>${itemsHtml}</tbody></table>
      <p>Sous-total : ${totals.subtotal} MAD<br>Livraison : ${totals.shippingFee} MAD<br>TVA (20 %) : ${totals.tax} MAD<br><strong>Total payé : ${totals.total} MAD</strong></p>
      <p>Nom : ${safe.name}<br>Téléphone : ${safe.phone}<br>Entreprise : ${safe.company || '-'}<br>Adresse : ${safe.address || '-'}</p>
      ${safe.message ? `<p>Message : ${safe.message}</p>` : ''}
    </body></html>`;
    const text = [
      'Confirmation de paiement SOMATISME',
      `Référence : ${order.sessionId}`,
      ...items.map((item) => `${item.name} — ${item.quantity} x ${item.price} MAD`),
      `Sous-total : ${totals.subtotal} MAD`,
      `Livraison : ${totals.shippingFee} MAD`,
      `TVA (20 %) : ${totals.tax} MAD`,
      `Total payé : ${totals.total} MAD`,
    ].join('\n');

    const mailer = getTransporter();
    const from = `"SOMATISME" <${process.env.SMTP_USER}>`;
    const adminEmail = process.env.EMAIL_TO || 'somatisme@gmail.com';
    await mailer.sendMail({
      from,
      to: adminEmail,
      replyTo: email,
      subject: `Paiement confirmé - ${order.sessionId}`,
      html,
      text: `${text}\nClient : ${name} (${email})\nTéléphone : ${sanitizePlainText(order.customerPhone, 24)}\nEntreprise : ${sanitizePlainText(order.company, 150)}\nAdresse : ${sanitizePlainText(order.address, 200)}\n${sanitizePlainText(order.message, 500)}`,
    });
    await mailer.sendMail({ from, to: email, subject: 'Confirmation de votre paiement - SOMATISME', html, text });
    if (redis) await redis.set(key, 'sent', { ex: 60 * 60 * 24 * 90 });
    else localOrderEmailStates.set(key, { state: 'sent', expiresAt: Date.now() + 90 * 24 * 60 * 60_000 });
    return 'sent';
  } catch (error) {
    if (redis) await redis.eval(releaseClaimScript, [key], [`processing:${claimToken}`]);
    else if (localOrderEmailStates.get(key)?.token === claimToken) localOrderEmailStates.delete(key);
    throw error;
  }
}

// Keep the former URL closed: paid order emails can only be triggered by the signed Stripe webhook.
export default function handler(_req: any, res: any) {
  return res.status(410).json({ error: 'Order email is sent after verified payment.' });
}
