import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message } = body;

    // Rate limiting check (simple IP-based)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    // Note: For production, use a proper rate limiting solution like Upstash Redis

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

    // Sanitize inputs to prevent XSS
    const sanitize = (str: string) => str.trim().replace(/[<>]/g, '');

    const subjectMap: Record<string, string> = {
      automation: 'Automatisme Industriel',
      regulation: 'Régulation & Instrumentation',
      electrical: 'Installation Électrique',
      maintenance: 'Maintenance Industrielle',
      other: 'Autre demande',
    };

    const emailSubject = `Nouvelle demande de contact: ${subjectMap[subject] || subject}`;
    const recipient = process.env.CONTACT_EMAIL || 'info@somatisme.ma';

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F172A;">Nouveau Message de Contact</h2>
        <p><strong>Nom:</strong> ${sanitize(name)}</p>
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${sanitize(phone)}</p>` : ''}
        ${company ? `<p><strong>Entreprise:</strong> ${sanitize(company)}</p>` : ''}
        <p><strong>Sujet:</strong> ${subjectMap[subject] || sanitize(subject)}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Message:</strong></p>
        <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${sanitize(message).replace(/\n/g, '<br>')}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">Ce message a été envoyé depuis le formulaire de contact du site SOMATISME.</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@somatisme.ma',
      to: recipient,
      subject: emailSubject,
      html: emailContent,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
