import nodemailer, { type Transporter } from 'nodemailer';
import { getProductById } from '../shared/products.js';
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  handleCors,
  isLikelyBot,
  isSafePdfBase64,
  isValidEmail,
  isValidPhone,
  logApiRequest,
  orderSchema,
  sanitizeHeaderValue,
  sanitizePlainText,
  sendError,
  verifyRecaptcha,
} from './_lib/security.js';

const ADMIN_EMAIL = process.env.EMAIL_TO || 'somatisme@gmail.com';
const acceptedOrders = new Map<string, { fingerprint: string; expiresAt: number }>();
let transporter: Transporter | undefined;

function getTransporter() {
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

export default async function handler(req: any, res: any) {
  logApiRequest(req, res);
  const cors = handleCors(req, res, ['POST', 'OPTIONS']);
  if (!cors.ok) {
    return sendError(res, 403, 'Origin not allowed');
  }
  if (cors.preflight) {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const contentLength = parseInt(String(req.headers['content-length'] || '0'), 10);
  if (contentLength > 2_000_000) {
    return sendError(res, 413, 'Request too large');
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`order-email:${ip}`, 4, 300_000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return sendError(res, 429, 'Too many requests. Please wait before trying again.');
  }

  if (isLikelyBot(req.body || {}, 1500)) {
    return res.status(200).json({ success: true });
  }

  try {
    const body = req.body || {};
    const parsed = orderSchema.safeParse({
      orderForm: {
        name: sanitizePlainText(body.orderForm?.name, 100),
        email: sanitizePlainText(body.orderForm?.email, 254).toLowerCase(),
        phone: sanitizePlainText(body.orderForm?.phone, 20),
        company: sanitizePlainText(body.orderForm?.company, 150),
        address: sanitizePlainText(body.orderForm?.address, 200),
        message: sanitizePlainText(body.orderForm?.message, 1000),
      },
      orderItems: Array.isArray(body.orderItems)
        ? body.orderItems.map((item: any) => ({
            productId: sanitizePlainText(item?.productId, 40),
            quantity: Number(item?.quantity),
          }))
        : [],
      cartTotal: Number(body.cartTotal),
      pdfBase64: typeof body.pdfBase64 === 'string' ? body.pdfBase64 : undefined,
      invoiceNumber: sanitizeHeaderValue(body.invoiceNumber, 60),
      recaptchaToken: sanitizePlainText(body.recaptchaToken, 2048) || undefined,
    });

    if (!parsed.success) {
      return sendError(res, 400, 'Invalid request payload');
    }

    const { orderForm, orderItems, cartTotal, pdfBase64, invoiceNumber, recaptchaToken } = parsed.data;

    if (!isValidEmail(orderForm.email)) {
      return sendError(res, 400, 'Adresse email invalide');
    }

    if (!isValidPhone(orderForm.phone)) {
      return sendError(res, 400, 'Numero de telephone invalide');
    }

    const quantitiesByProduct = new Map<string, number>();
    for (const item of orderItems) {
      quantitiesByProduct.set(item.productId, (quantitiesByProduct.get(item.productId) || 0) + item.quantity);
    }

    const trustedItems = orderItems.map((item) => {
      const product = getProductById(item.productId);
      if (!product || (quantitiesByProduct.get(item.productId) || 0) > product.stock) {
        return null;
      }
      return {
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    if (trustedItems.some((item) => item === null)) {
      return sendError(res, 400, 'Produit indisponible ou quantité invalide');
    }

    const verifiedItems = trustedItems.filter((item): item is NonNullable<typeof item> => item !== null);
    const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = Math.round(subtotal * 0.02);
    const taxAmount = Math.round(subtotal * 0.2);
    const calculatedTotal = subtotal + shippingFee + taxAmount;

    if (Math.abs(calculatedTotal - cartTotal) > 0.01) {
      return sendError(res, 400, 'Le total de la commande a changé. Actualisez votre panier.');
    }

    const orderFingerprint = [
      orderForm.name,
      orderForm.email,
      orderForm.phone,
      orderForm.company,
      orderForm.address,
      orderForm.message,
      calculatedTotal,
      orderItems.map((item) => `${item.productId}:${item.quantity}`).sort().join(','),
    ].join('|');
    const now = Date.now();
    for (const [key, entry] of acceptedOrders) {
      if (entry.expiresAt <= now) acceptedOrders.delete(key);
    }
    const existingOrder = acceptedOrders.get(invoiceNumber);
    if (existingOrder) {
      if (existingOrder.fingerprint !== orderFingerprint) {
        return sendError(res, 409, 'Cette référence de commande est déjà utilisée.');
      }
      return res.status(200).json({ success: true, message: 'Commande déjà enregistrée.' });
    }

    // The catalog and all prices come from the server-side catalog, never the browser payload.
    const trustedOrderItems = verifiedItems;

    if (pdfBase64 && !isSafePdfBase64(pdfBase64)) {
      return sendError(res, 400, 'Invalid PDF attachment');
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error('[SECURITY] RECAPTCHA_SECRET_KEY is missing in environment variables');
    }

    const isHuman = await verifyRecaptcha(recaptchaToken, 0.3, 'order_submit');

    if (!isHuman) {
      console.warn(`[ORDER] Security check failed (low score or invalid token) for IP: ${ip}`);
      return sendError(res, 403, 'Verification de securite echouee');
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[EMAIL] SMTP credentials not configured');
      return sendError(res, 500, 'Email service unavailable');
    }

    const transporter = getTransporter();
    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const orderNumber = invoiceNumber;

    const customerSubject = sanitizeHeaderValue(
      `Demande de commande reçue - SOMATISME - ${invoiceNumber}`,
      160
    );
    const adminSubject = sanitizeHeaderValue(
      `NOUVELLE DEMANDE - ${orderForm.name} - ${invoiceNumber}`,
      160
    );

    const itemsHtml = trustedOrderItems
      .map(
        (item, idx) => `
          <div style="padding:14px 18px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;">
            <span style="color:#cbd5e1;font-size:14px;">${idx + 1}. ${escapeHtml(item.name)} — ${item.quantity} × ${item.price} MAD</span>
            <span style="color:#06b6d4;font-size:14px;font-weight:700;">${item.price * item.quantity} MAD</span>
          </div>`
      )
      .join('');

    const customerHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#0e7490 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;">Demande bien reçue</h1>
          <p style="color:#94a3b8;font-size:14px;margin:0;">Ref: <strong style="color:#06b6d4;">${escapeHtml(orderNumber)}</strong> - ${date}</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="color:#1e293b;font-size:16px;margin:0 0 24px;">Bonjour <strong>${escapeHtml(orderForm.name)}</strong>,</p>
          <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 30px;">Merci pour votre demande. Notre équipe vérifie la disponibilité des articles et les modalités de livraison. Votre commande sera confirmée après validation avec vous.</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
            <div style="background:#1e3a5f;padding:14px 20px;">
              <p style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0;">Produits commandes</p>
            </div>
            <div style="padding:20px;">
              ${itemsHtml}
              <div style="padding:14px 0 0;color:#475569;font-size:14px;line-height:1.8;">
                <div style="display:flex;justify-content:space-between;"><span>Sous-total</span><span>${subtotal} MAD</span></div>
                <div style="display:flex;justify-content:space-between;"><span>Livraison estimative</span><span>${shippingFee} MAD</span></div>
                <div style="display:flex;justify-content:space-between;"><span>TVA (20%)</span><span>${taxAmount} MAD</span></div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0 0;">
                <p style="color:#1e293b;font-size:16px;font-weight:700;margin:0;">TOTAL ESTIMATIF</p>
                <p style="color:#0e7490;font-size:22px;font-weight:800;margin:0;">${calculatedTotal} MAD</p>
              </div>
            </div>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const adminHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#0e7490 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;">Nouvelle demande de commande</h1>
          <div style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.4);border-radius:20px;display:inline-block;padding:4px 16px;margin-top:8px;">
            <span style="color:#fca5a5;font-size:12px;font-weight:700;">ACTION REQUISE</span>
          </div>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.25);border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Reference commande</p>
            <p style="color:#06b6d4;font-size:20px;font-weight:800;margin:0;letter-spacing:2px;">${escapeHtml(orderNumber)}</p>
            <p style="color:#64748b;font-size:12px;margin:4px 0 0;">${date}</p>
          </div>
          <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Informations client</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="50%" style="padding:0 8px 12px 0;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Nom</p>
                  <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">${escapeHtml(orderForm.name)}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 12px 8px;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Telephone</p>
                  <p style="color:#06b6d4;font-size:14px;font-weight:600;margin:0;">${escapeHtml(orderForm.phone)}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding:0 8px 0 0;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Email</p>
                  <p style="color:#06b6d4;font-size:14px;font-weight:600;margin:0;">${escapeHtml(orderForm.email)}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 0 8px;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Entreprise</p>
                  <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">${escapeHtml(orderForm.company || '-')}</p>
                </div>
              </td>
            </tr>
          </table>
          <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Produits commandes</p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;overflow:hidden;margin-bottom:28px;">
            ${itemsHtml}
            <div style="padding:14px 18px 0;color:#cbd5e1;font-size:14px;line-height:1.8;">
              <div style="display:flex;justify-content:space-between;"><span>Sous-total</span><span>${subtotal} MAD</span></div>
              <div style="display:flex;justify-content:space-between;"><span>Livraison estimative</span><span>${shippingFee} MAD</span></div>
              <div style="display:flex;justify-content:space-between;"><span>TVA (20%)</span><span>${taxAmount} MAD</span></div>
            </div>
            <div style="padding:16px 18px;background:#0c1929;display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#94a3b8;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Total estimatif</span>
              <span style="color:#06b6d4;font-size:24px;font-weight:800;">${calculatedTotal} MAD</span>
            </div>
          </div>
          ${orderForm.message ? `
            <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #06b6d4;border-radius:10px;padding:16px 18px;margin-bottom:28px;">
              <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Message du client</p>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(orderForm.message)}</p>
            </div>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const attachments = pdfBase64
      ? [{
          filename: `Commande_${sanitizeHeaderValue(invoiceNumber, 40)}_SOMATISME.pdf`,
          content: pdfBase64,
          encoding: 'base64',
          contentType: 'application/pdf',
        }]
      : [];

    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: orderForm.email,
      subject: adminSubject,
      html: adminHtml,
      text: [
        'Nouvelle demande de commande',
        `Nom: ${orderForm.name}`,
        `Email: ${orderForm.email}`,
        `Telephone: ${orderForm.phone}`,
        `Entreprise: ${orderForm.company || '-'}`,
        `Adresse: ${orderForm.address || '-'}`,
        `Recapitulatif de commande: ${invoiceNumber}`,
        ...trustedOrderItems.map((item) => `${item.name}: ${item.quantity} x ${item.price} MAD = ${item.price * item.quantity} MAD`),
        `Sous-total: ${subtotal} MAD`,
        `Livraison estimative: ${shippingFee} MAD`,
        `TVA (20%): ${taxAmount} MAD`,
        `Total estimatif: ${calculatedTotal} MAD`,
      ].join('\n'),
      attachments,
    });

    acceptedOrders.set(invoiceNumber, { fingerprint: orderFingerprint, expiresAt: now + 24 * 60 * 60 * 1000 });

    let customerEmailSent = true;
    try {
      await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: orderForm.email,
      subject: customerSubject,
      html: customerHtml,
      text: [
        'Demande de commande recue - SOMATISME',
        `Reference: ${orderNumber}`,
        `Recapitulatif de commande: ${invoiceNumber}`,
        ...trustedOrderItems.map((item) => `${item.name}: ${item.quantity} x ${item.price} MAD = ${item.price * item.quantity} MAD`),
        `Sous-total: ${subtotal} MAD`,
        `Livraison estimative: ${shippingFee} MAD`,
        `TVA (20%): ${taxAmount} MAD`,
        `Total estimatif: ${calculatedTotal} MAD`,
      ].join('\n'),
      attachments,
      });
    } catch (emailError: any) {
      customerEmailSent = false;
      console.error('[ORDER] Admin received the order, but customer confirmation failed:', emailError?.message || emailError);
    }



    return res.status(200).json({
      success: true,
      message: customerEmailSent
        ? 'Votre demande est reçue. Un récapitulatif vous a été envoyé par email.'
        : 'Votre demande est reçue, mais le récapitulatif email n’a pas pu être envoyé pour le moment.',
    });
  } catch (error: any) {
    console.error('[ERROR] Order email error:', error?.message || error);
    return sendError(res, 500, 'Une erreur est survenue lors du traitement de votre commande.');
  }
}
