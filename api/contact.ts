import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import {
  checkRateLimit,
  escapeHtml,
  sanitizeString,
  isValidEmail,
  getClientIp,
  setCorsHeaders,
  sendError,
  verifyRecaptcha,
} from './_lib/security';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

  // Body size guard (~20 KB max)
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 20_000) return sendError(res, 413, 'Request too large');

  // Rate limiting: 5 requests / minute per IP
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 5, 60_000)) {
    return sendError(res, 429, 'Too many requests. Please wait before trying again.');
  }

  try {
    // Sanitize & validate inputs
    const name    = sanitizeString(req.body?.name, 100);
    const email   = sanitizeString(req.body?.email, 254);
    const phone   = sanitizeString(req.body?.phone, 20);
    const company = sanitizeString(req.body?.company, 150);
    const subject = sanitizeString(req.body?.subject, 200);
    const message = sanitizeString(req.body?.message, 2000);

    if (!name || !email || !subject || !message) {
      return sendError(res, 400, 'Champs obligatoires manquants');
    }
    if (!isValidEmail(email)) {
      return sendError(res, 400, 'Adresse email invalide');
    }
    if (name.length < 2)   return sendError(res, 400, 'Nom trop court');
    if (subject.length < 3) return sendError(res, 400, 'Sujet trop court');
    if (message.length < 5) return sendError(res, 400, 'Message trop court');

    // reCAPTCHA v3 verification (skipped gracefully if key not configured)
    const recaptchaToken = sanitizeString(req.body?.recaptchaToken, 2048);
    const isHuman = await verifyRecaptcha(recaptchaToken, 0.5);
    if (!isHuman) {
      console.warn('[SECURITY] reCAPTCHA failed from IP:', ip);
      return sendError(res, 403, 'Verification de securite echouee. Veuillez reessayer.');
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[EMAIL] SMTP_USER or SMTP_PASS not configured');
      return sendError(res, 500, 'Email service unavailable');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // All escaped values for safe HTML rendering
    const safeName    = escapeHtml(name);
    const safeEmail   = escapeHtml(email);
    const safePhone   = escapeHtml(phone);
    const safeCompany = escapeHtml(company);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const safeIp      = escapeHtml(ip);

    // Safe email subject (strip newlines to prevent header injection)
    const emailSubject = `Nouvelle demande de contact: ${safeSubject}`.replace(/[\r\n]/g, '');

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#0e7490 100%);border-radius:16px 16px 0 0;padding:40px 40px 30px;text-align:center;">
          <div style="display:inline-block;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);border-radius:12px;padding:8px 20px;margin-bottom:16px;">
            <span style="color:#06b6d4;font-size:11px;font-weight:700;letter-spacing:3px;">SOMATISME</span>
          </div>
          <h1 style="color:#fff;font-size:26px;font-weight:700;margin:0 0 8px;">Nouvelle Demande de Contact</h1>
          <p style="color:#94a3b8;font-size:14px;margin:0;">${date}</p>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.25);border-radius:10px;padding:16px 20px;margin-bottom:30px;">
            <span style="color:#06b6d4;font-size:13px;font-weight:600;">Un prospect vous a contact&#233; via le site web</span>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Nom</p>
                  <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${safeName}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Email</p>
                  <p style="color:#06b6d4;font-size:15px;font-weight:600;margin:0;">${safeEmail}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">T&#233;l&#233;phone</p>
                  <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${safePhone || 'Non fourni'}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Entreprise</p>
                  <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${safeCompany || 'Non fourni'}</p>
                </div>
              </td>
            </tr>
          </table>
          <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #06b6d4;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
            <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 6px;">Sujet</p>
            <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${safeSubject}</p>
          </div>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:20px;margin-bottom:20px;">
            <p style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 12px;">Message</p>
            <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${safeMessage}</p>
          </div>
          <p style="color:#475569;font-size:12px;margin:0;">IP: ${safeIp}</p>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="color:#334155;font-size:12px;margin:0 0 4px;">SOMATISME — Automatisation Industrielle</p>
          <p style="color:#334155;font-size:11px;margin:0;">Mohammedia, Maroc &bull; info@somatisme.ma</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || 'info@somatisme.ma',
      subject: emailSubject,
      html: htmlContent,
    });

    console.log('[EMAIL] Contact form email sent via SMTP Gmail');
    return res.status(200).json({ success: true, message: 'Email envoy&#233; avec succ&#232;s' });
  } catch (error) {
    console.error('[ERROR] Contact form error:', error);
    return sendError(res, 500, 'Une erreur est survenue. Veuillez r&#233;essayer.');
  }
}
