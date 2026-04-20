import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderForm, orderItems, cartTotal } = req.body;

    if (!orderForm || !orderForm.email || !orderItems || !cartTotal) {
      return res.status(400).json({ error: 'Missing required order information' });
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

    // Customer email HTML
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e3a5f;">Confirmation de Commande</h2>
        <p>Bonjour <strong>${orderForm.name}</strong>,</p>
        <p>Merci pour votre commande ! Voici les détails :</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #06b6d4; margin: 20px 0;">
          ${orderItems.map((item: any, idx: number) => `
            <p><strong>${idx + 1}. ${item.name}</strong> - ${item.price} MAD</p>
          `).join('')}
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
          <p style="font-size: 18px;"><strong>Total :</strong> <span style="color: #06b6d4;">${cartTotal} MAD</span></p>
        </div>
        <p>Nous confirmerons votre commande dans les 24 heures.<br>Paiement a la livraison.</p>
        <p style="color: #999; font-size: 12px;">Cet email a ete envoye depuis le systeme de commande SOMATISME.</p>
      </div>
    `;

    // Admin email HTML
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e3a5f;">NOUVELLE COMMANDE</h2>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Informations Client</h3>
          <p><strong>Nom :</strong> ${orderForm.name}</p>
          <p><strong>Email :</strong> ${orderForm.email}</p>
          <p><strong>Telephone :</strong> ${orderForm.phone}</p>
          ${orderForm.company ? `<p><strong>Entreprise :</strong> ${orderForm.company}</p>` : ''}
          ${orderForm.address ? `<p><strong>Adresse :</strong> ${orderForm.address}</p>` : ''}
        </div>
        <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Produits Commandes</h3>
          ${orderItems.map((item: any, idx: number) => `
            <p><strong>${idx + 1}. ${item.name}</strong> - ${item.price} MAD</p>
          `).join('')}
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
          <p style="font-size: 18px;"><strong>Total :</strong> <span style="color: #06b6d4;">${cartTotal} MAD</span></p>
        </div>
        ${orderForm.message ? `
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Message du client :</h3>
            <p>${orderForm.message}</p>
          </div>
        ` : ''}
        <p>Veuillez contacter le client dans les 24 heures pour confirmer la commande.</p>
      </div>
    `;

    // Send customer email via SMTP Gmail
    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: orderForm.email,
      subject: 'Confirmation de votre commande SOMATISME',
      html: customerHtml,
    });
    console.log('[EMAIL] Customer order email sent via SMTP Gmail');

    // Send admin email via SMTP Gmail
    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || 'info@somatisme.ma',
      subject: `NOUVELLE COMMANDE - ${orderForm.name}`,
      html: adminHtml,
    });
    console.log('[EMAIL] Admin order email sent via SMTP Gmail');

    return res.status(200).json({ success: true, message: 'Commande recue. Confirmation envoyee par email.' });
  } catch (error) {
    console.error('[ERROR] Order email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to send order email: ${errorMessage}` });
  }
}
