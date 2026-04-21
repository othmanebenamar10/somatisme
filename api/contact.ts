import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const name    = String(body.name    || '').trim().slice(0, 100);
    const email   = String(body.email   || '').trim().slice(0, 254);
    const phone   = String(body.phone   || '').trim().slice(0, 20);
    const company = String(body.company || '').trim().slice(0, 150);
    const subject = String(body.subject || '').trim().slice(0, 200);
    const message = String(body.message || '').trim().slice(0, 2000);

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[CONTACT] SMTP not configured');
      return res.status(500).json({ error: 'Email service unavailable' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

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
  <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.25);border-radius:10px;padding:14px 18px;margin-bottom:24px">
    <p style="color:#06b6d4;font-size:13px;font-weight:600;margin:0">&#9889; Un prospect vous a contact&eacute; via le site web</p>
  </div>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="50%" style="padding:0 8px 14px 0;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Nom</p>
          <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0">${esc(name)}</p>
        </div>
      </td>
      <td width="50%" style="padding:0 0 14px 8px;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Email</p>
          <p style="color:#06b6d4;font-size:14px;font-weight:600;margin:0">${esc(email)}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td width="50%" style="padding:0 8px 14px 0;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">T&eacute;l&eacute;phone</p>
          <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0">${phone ? esc(phone) : '<span style="color:#475569;font-style:italic">Non fourni</span>'}</p>
        </div>
      </td>
      <td width="50%" style="padding:0 0 14px 8px;vertical-align:top">
        <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px">
          <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Entreprise</p>
          <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0">${company ? esc(company) : '<span style="color:#475569;font-style:italic">Non fournie</span>'}</p>
        </div>
      </td>
    </tr>
  </table>
  <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #fbbf24;border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:14px">
    <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 5px">Sujet</p>
    <p style="color:#fbbf24;font-size:14px;font-weight:600;margin:0">${esc(subject)}</p>
  </div>
  <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #3b82f6;border-radius:0 10px 10px 0;padding:16px;margin-bottom:20px">
    <p style="color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px">Message</p>
    <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap">${esc(message)}</p>
  </div>
  <div style="text-align:center">
    <a href="mailto:${esc(email)}?subject=Re: ${esc(subject)}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700">
      &#9993; R&eacute;pondre &agrave; ${esc(name)}
    </a>
  </div>
</td></tr>
<tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #1e293b">
  <p style="color:#334155;font-size:11px;margin:0">SOMATISME &mdash; Automatisation Industrielle &bull; Mohammedia, Maroc</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contact] ${subject.replace(/[\r\n]/g,'')} — ${name.replace(/[\r\n]/g,'')}`,
      html,
    });

    console.log('[CONTACT] Email sent to', process.env.EMAIL_TO || process.env.SMTP_USER);
    return res.status(200).json({ success: true, message: 'Votre message a &eacute;t&eacute; envoy&eacute; avec succ&egrave;s !' });

  } catch (error: any) {
    console.error('[CONTACT] Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Erreur lors de l\'envoi' });
  }
}
