import nodemailer from 'nodemailer';
import {
  checkRateLimit,
  contactSchema,
  escapeHtml,
  getClientIp,
  handleCors,
  isLikelyBot,
  isValidEmail,
  isValidPhone,
  sanitizeHeaderValue,
  sanitizePlainText,
  sendError,
  verifyRecaptcha,
} from './_lib/security.js';

const ADMIN_EMAIL = process.env.EMAIL_TO || 'somatisme@gmail.com';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export default async function handler(req: any, res: any) {
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
  if (contentLength > 25_000) {
    return sendError(res, 413, 'Request too large');
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 60_000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return sendError(res, 429, 'Too many requests. Please retry later.');
  }

  if (isLikelyBot(req.body || {}, 1500)) {
    return res.status(200).json({ success: true });
  }

  try {
    const body = req.body || {};
    const parsed = contactSchema.safeParse({
      name: sanitizePlainText(body.name, 100),
      email: sanitizePlainText(body.email, 254).toLowerCase(),
      phone: sanitizePlainText(body.phone, 20),
      company: sanitizePlainText(body.company, 150),
      subject: sanitizeHeaderValue(body.subject, 200),
      message: sanitizePlainText(body.message, 2000),
      recaptchaToken: sanitizePlainText(body.recaptchaToken, 2048) || undefined,
    });

    if (!parsed.success) {
      return sendError(res, 400, 'Invalid request payload');
    }

    const { name, email, phone, company, subject, message, recaptchaToken } = parsed.data;

    if (!isValidEmail(email)) {
      return sendError(res, 400, 'Adresse email invalide');
    }

    if (phone && !isValidPhone(phone)) {
      return sendError(res, 400, 'Numero de telephone invalide');
    }

    const isHuman = await verifyRecaptcha(recaptchaToken, 0.4);
    
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error('[SECURITY] RECAPTCHA_SECRET_KEY is not configured');
    }

    if (!isHuman) {
      console.warn(`[CONTACT] Security check failed (low score or invalid token) for IP: ${ip}`);
      return sendError(res, 403, 'Verification de securite echouee');
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[CONTACT] SMTP not configured');
      return sendError(res, 500, 'Email service unavailable');
    }

    const transporter = getTransporter();
    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="background:linear-gradient(135deg,#1e3a5f,#0e7490);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center">
  <div style="display:inline-block;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);border-radius:10px;padding:8px 20px;margin-bottom:14px">
    <span style="color:#06b6d4;font-size:11px;font-weight:700;letter-spacing:3px">SOMATISME</span>
  </div>
  <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 6px">Nouvelle Demande de Contact</h1>
  <p style="color:#94a3b8;font-size:13px;margin:0">${date}</p>
</td></tr>
<tr><td style="background:#1e293b;padding:32px 40px">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="50%" style="padding:0 8px 14px 0;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Nom</p>
          <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0">${escapeHtml(name)}</p>
        </div>
      </td>
      <td width="50%" style="padding:0 0 14px 8px;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Email</p>
          <p style="color:#06b6d4;font-size:14px;font-weight:600;margin:0">${escapeHtml(email)}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td width="50%" style="padding:0 8px 14px 0;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Telephone</p>
          <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0">${phone ? escapeHtml(phone) : '<span style="color:#475569;font-style:italic">Non fourni</span>'}</p>
        </div>
      </td>
      <td width="50%" style="padding:0 0 14px 8px;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Entreprise</p>
          <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0">${company ? escapeHtml(company) : '<span style="color:#475569;font-style:italic">Non fournie</span>'}</p>
        </div>
      </td>
    </tr>
  </table>
  <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #fbbf24;border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:14px">
    <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Sujet</p>
    <p style="color:#fbbf24;font-size:14px;font-weight:600;margin:0">${escapeHtml(subject)}</p>
  </div>
  <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #3b82f6;border-radius:0 10px 10px 0;padding:16px;margin-bottom:20px">
    <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px">Message</p>
    <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
  </div>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[Contact] ${sanitizeHeaderValue(subject, 120)} - ${sanitizeHeaderValue(name, 80)}`,
      html,
      text: [
        'Nouvelle demande de contact',
        `Nom: ${name}`,
        `Email: ${email}`,
        `Telephone: ${phone || 'Non fourni'}`,
        `Entreprise: ${company || 'Non fournie'}`,
        `Sujet: ${subject}`,
        '',
        message,
      ].join('\n'),
    });

    return res.status(200).json({
      success: true,
      message: 'Votre message a ete envoye avec succes.',
    });
  } catch (error: any) {
    console.error('[CONTACT] Error:', error?.message || error);
    return sendError(res, 500, 'Erreur lors de l envoi du message.');
  }
}
