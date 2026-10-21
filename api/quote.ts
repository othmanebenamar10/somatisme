import { randomUUID } from 'node:crypto';
import nodemailer, { type Transporter } from 'nodemailer';
import { z } from 'zod';
import { getProductById } from '../shared/products.js';
import { calculateOrderTotals } from './_lib/pricing.js';
import { createQuotePdf } from './_lib/quote-pdf.js';
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  handleCors,
  isValidEmail,
  isValidPhone,
  logApiRequest,
  sanitizeHeaderValue,
  sanitizePlainText,
  sendError,
  verifyRecaptcha,
} from './_lib/security.js';

const quoteSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1).max(40),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
  customerInfo: z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(3).max(254),
    phone: z.string().min(7).max(24),
    company: z.string().max(150).optional().default(''),
    address: z.string().max(200).optional().default(''),
    message: z.string().max(500).optional().default(''),
  }),
  recaptchaToken: z.string().max(2048).nullable().optional(),
});

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

function quoteEmailHtml(name: string, quoteNumber: string, itemCount: number): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f233a">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f1f5f9"><tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden">
        <tr><td style="padding:28px 32px;background:#0f233a;color:#fff"><div style="font-size:22px;font-weight:bold;letter-spacing:1px">SOMATISME</div><div style="margin-top:6px;color:#bfdbE8;font-size:12px">AUTOMATISME · RÉGULATION · ÉLECTRICITÉ INDUSTRIELLE</div></td></tr>
        <tr><td style="padding:32px"><p style="margin:0 0 12px;font-size:20px;font-weight:bold">Bonjour ${escapeHtml(name)},</p>
          <p style="margin:0 0 20px;color:#475569;line-height:1.6">Votre demande de devis a bien été reçue. Vous trouverez en pièce jointe le récapitulatif PDF de ${itemCount} article${itemCount > 1 ? 's' : ''}.</p>
          <div style="padding:16px 18px;background:#f1f5f9;border-left:4px solid #0596b2;border-radius:8px"><div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Référence du devis</div><div style="margin-top:5px;font-size:17px;font-weight:bold">${escapeHtml(quoteNumber)}</div></div>
          <p style="margin:22px 0 0;color:#475569;line-height:1.6">Ce document est un devis estimatif et ne constitue pas une facture. Notre équipe vous contactera pour confirmer la disponibilité et les modalités de votre demande.</p>
          <p style="margin:22px 0 0;color:#475569">Une question ? Répondez à cet email ou contactez-nous au <strong>+212 679 825 646</strong>.</p>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:11px;text-align:center">SOMATISME · Mohammedia, Maroc · somatisme.ma</td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

export default async function handler(req: any, res: any) {
  logApiRequest(req, res);
  const cors = handleCors(req, res, ['POST', 'OPTIONS']);
  if (!cors.ok) return sendError(res, 403, 'Origin not allowed');
  if (cors.preflight) return res.status(204).end();
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

  const contentLength = Number.parseInt(String(req.headers['content-length'] || '0'), 10);
  if (contentLength > 25_000) return sendError(res, 413, 'Request too large');

  const ip = getClientIp(req);
  try {
    const limit = await checkRateLimit(`quote:${ip}`, 3, 60_000);
    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds));
      return sendError(res, 429, 'Trop de demandes. Veuillez réessayer plus tard.');
    }
  } catch (error) {
    console.error('[QUOTE] Rate limiter unavailable:', error);
    return sendError(res, 503, 'Service temporairement indisponible.');
  }

  const parsed = quoteSchema.safeParse(req.body || {});
  if (!parsed.success) return sendError(res, 400, 'Informations de devis invalides.');

  const { items, customerInfo, recaptchaToken } = parsed.data;
  const customer = {
    name: sanitizePlainText(customerInfo.name, 100),
    email: sanitizePlainText(customerInfo.email, 254).toLowerCase(),
    phone: sanitizePlainText(customerInfo.phone, 24),
    company: sanitizePlainText(customerInfo.company, 150),
    address: sanitizePlainText(customerInfo.address, 200),
    message: sanitizePlainText(customerInfo.message, 500),
  };
  if (!isValidEmail(customer.email) || !isValidPhone(customer.phone)) {
    return sendError(res, 400, 'Adresse email ou téléphone invalide.');
  }

  if (!process.env.RECAPTCHA_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.error('[QUOTE] RECAPTCHA_SECRET_KEY is required in production');
    return sendError(res, 503, 'Le formulaire de devis est temporairement indisponible.');
  }
  if (process.env.RECAPTCHA_SECRET_KEY
    && !await verifyRecaptcha(recaptchaToken, 0.4, 'quote_request')) {
    return sendError(res, 403, 'La vérification anti-spam a échoué. Veuillez réessayer.');
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('[QUOTE] SMTP is not configured');
    return sendError(res, 503, 'Envoi du devis temporairement indisponible.');
  }

  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }
  const verifiedItems = [...quantities.entries()].map(([productId, quantity]) => {
    const product = getProductById(productId);
    return product && quantity <= product.stock ? { product, quantity } : null;
  });
  if (verifiedItems.some((item) => item === null)) {
    return sendError(res, 400, 'Un produit est indisponible ou la quantité demandée est invalide.');
  }

  try {
    const catalogItems = verifiedItems.filter((item): item is NonNullable<typeof item> => item !== null);
    const subtotal = catalogItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totals = calculateOrderTotals(subtotal);
    const now = new Date();
    const quoteNumber = `DEV-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const pdf = createQuotePdf({
      quoteNumber,
      issuedAt: now,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerCompany: customer.company,
      customerAddress: customer.address,
      message: customer.message,
      items: catalogItems.map(({ product, quantity }) => ({
        name: product.name,
        reference: product.reference || '',
        quantity,
        unitPrice: product.price,
        total: product.price * quantity,
      })),
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      tax: totals.tax,
      total: totals.total,
    });

    const transporter = getTransporter();
    const from = `"SOMATISME" <${process.env.SMTP_USER}>`;
    const html = quoteEmailHtml(customer.name, quoteNumber, catalogItems.length);
    const attachment = {
      filename: `${quoteNumber}.pdf`,
      content: pdf,
      contentType: 'application/pdf',
    };
    await Promise.all([
      transporter.sendMail({
        from,
        to: customer.email,
        replyTo: process.env.EMAIL_TO || 'somatisme@gmail.com',
        subject: `Votre devis SOMATISME ${quoteNumber}`,
        html,
        text: `Bonjour ${customer.name},\n\nVeuillez trouver en pièce jointe votre devis ${quoteNumber}. Ce document est estimatif et ne constitue pas une facture.\n\nSOMATISME — +212 679 825 646`,
        attachments: [attachment],
      }),
      transporter.sendMail({
        from,
        to: process.env.EMAIL_TO || 'somatisme@gmail.com',
        replyTo: customer.email,
        subject: `[Demande de devis ${quoteNumber}] ${sanitizeHeaderValue(customer.name, 80)}`,
        html,
        text: `Nouvelle demande de devis ${quoteNumber}\nClient : ${customer.name}\nEmail : ${customer.email}\nTéléphone : ${customer.phone}\nEntreprise : ${customer.company}\nAdresse : ${customer.address}\n\n${customer.message}`,
        attachments: [attachment],
      }),
    ]);

    return res.status(200).json({ success: true, quoteNumber });
  } catch (error: any) {
    console.error('[QUOTE] Failed to create or send quote:', error?.message || error);
    return sendError(res, 500, 'Impossible de préparer le devis pour le moment.');
  }
}
