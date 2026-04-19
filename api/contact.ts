import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, subject, message } = req.body;

    const ip = req.headers['x-forwarded-for'] as string || 'unknown';

    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(06\d{8}|(\+212|00212)\d{9})$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Sanitize inputs
    const sanitize = (str: string) => str.trim().replace(/[<>]/g, '');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Nouvelle demande de contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nom:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(email)}</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Téléphone:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(phone)}</td>
          </tr>
          ` : ''}
          ${company ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Entreprise:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(company)}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Sujet:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitize(subject)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>IP:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${ip}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <strong style="color: #333;">Message:</strong>
          <p style="color: #666; white-space: pre-wrap; margin-top: 10px;">${sanitize(message)}</p>
        </div>
        <p style="margin-top: 20px; color: #999; font-size: 12px;">Cet email a été envoyé depuis le formulaire de contact du site SOMATISME.</p>
      </div>
    `;

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return res.status(500).json({ error: 'SMTP not configured' });
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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.EMAIL_TO || 'info@somatisme.ma',
      subject: `Nouvelle demande de contact: ${subject}`,
      html: emailContent,
    });

    console.log('Email sent successfully for:', email);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Contact API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
