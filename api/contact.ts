import nodemailer from 'nodemailer';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message } = body;

    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Input validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(06\d{8}|(\+212|00212)\d{9})$/;
    if (phone && !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
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

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
