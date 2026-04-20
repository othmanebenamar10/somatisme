import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

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

    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('[EMAIL] RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Nouvelle demande de contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nom:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Téléphone:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'Non fourni'}</td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Entreprise:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${company}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Sujet:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>IP:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${req.headers['x-forwarded-for'] || 'unknown'}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <strong>Message:</strong>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'SOMATISME <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'info@somatisme.ma',
      subject: `Nouvelle demande de contact: ${subject}`,
      html: htmlContent,
    });

    console.log('[EMAIL] Contact form email sent via Resend:', result);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('[ERROR] Contact form error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to send email: ${errorMessage}` });
  }
}
