import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate SMTP config
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[EMAIL] SMTP_USER or SMTP_PASS not configured');
      return res.status(500).json({ error: 'Email service not configured' });
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

    const ip = req.headers['x-forwarded-for'] || 'unknown';
    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Email content
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#0e7490 100%);border-radius:16px 16px 0 0;padding:40px 40px 30px;text-align:center;">
          <div style="display:inline-block;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);border-radius:12px;padding:8px 20px;margin-bottom:16px;">
            <span style="color:#06b6d4;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">SOMATISME</span>
          </div>
          <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;">Nouvelle Demande de Contact</h1>
          <p style="color:#94a3b8;font-size:14px;margin:0;">${date}</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#1e293b;padding:40px;">

          <!-- Alert badge -->
          <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.25);border-radius:10px;padding:16px 20px;margin-bottom:30px;display:flex;align-items:center;">
            <span style="color:#06b6d4;font-size:13px;font-weight:600;">📬 Un prospect vous a contacté via le site web</span>
          </div>

          <!-- Info grid -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Nom</p>
                  <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${name}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Email</p>
                  <p style="color:#06b6d4;font-size:15px;font-weight:600;margin:0;">${email}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Téléphone</p>
                  <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${phone || 'Non fourni'}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 18px;">
                  <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Entreprise</p>
                  <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${company || 'Non fourni'}</p>
                </div>
              </td>
            </tr>
          </table>

          <!-- Subject -->
          <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #06b6d4;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
            <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Sujet</p>
            <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0;">${subject}</p>
          </div>

          <!-- Message -->
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:20px;margin-bottom:20px;">
            <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Message</p>
            <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${message}</p>
          </div>

          <!-- IP -->
          <p style="color:#475569;font-size:12px;margin:0;">IP: ${ip}</p>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="color:#334155;font-size:12px;margin:0 0 4px;">SOMATISME — Automatisation Industrielle</p>
          <p style="color:#334155;font-size:11px;margin:0;">Mohammedia, Maroc • info@somatisme.ma • +212 523 302 829</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send email via SMTP
    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || 'info@somatisme.ma',
      subject: `Nouvelle demande de contact: ${subject}`,
      html: htmlContent,
    });

    console.log('[EMAIL] Contact form email sent via SMTP Gmail');

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('[ERROR] Contact form error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to send email: ${errorMessage}` });
  }
}
