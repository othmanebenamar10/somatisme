import express from 'express';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import ContactSubmission from '../models/ContactSubmission';
import { auditLogger, sanitizeInput } from '../security';
import { getContactEmailHtml } from '../templates/email';

const router = express.Router();

const contactSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(2, "Sujet requis"),
  message: z.string().min(10, "Message trop court"),
  recaptchaToken: z.string().optional(),
  _duration: z.number().optional()
});

router.post("/contact", async (req, res) => {
  try {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const sanitizedBody = sanitizeInput(req.body);
    
    // Zod Validation
    const result = contactSchema.safeParse(sanitizedBody);
    if (!result.success) {
      return res.status(400).json({ error: "Validation échouée", details: result.error.errors });
    }
    
    const { name, email, phone, company, subject, message, recaptchaToken, _duration } = result.data;

    // Fast form submission check (bot detection)
    if (_duration && _duration < 2000) {
      console.warn(`[SECURITY] Bot detected by form speed from IP: ${ip}`);
      return res.status(400).json({ error: "Soumission trop rapide" });
    }

    // Google reCAPTCHA Verification
    if (process.env.RECAPTCHA_SECRET_KEY && recaptchaToken) {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
      const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
      const recaptchaJson = await recaptchaRes.json();
      
      if (!recaptchaJson.success || recaptchaJson.score < 0.5) {
        console.warn(`[SECURITY] Bot detected by reCAPTCHA from IP: ${ip}, Score: ${recaptchaJson.score}`);
        return res.status(403).json({ error: "Échec de validation reCAPTCHA (Bot détecté)" });
      }
    }

    // Save to MongoDB
    try {
      const newSubmission = new ContactSubmission({
        name, email, phone, company, subject, message, ip
      });
      await newSubmission.save();
    } catch (dbError) {
      console.error("[DB ERROR] Failed to save contact submission:", dbError);
      // We continue to send the email even if DB fails
    }

    // Send Email
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("[EMAIL] SMTP_USER or SMTP_PASS not configured");
      return res.status(500).json({ error: "Service email indisponible" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const now = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca', dateStyle: 'full', timeStyle: 'short' });
    const htmlContent = getContactEmailHtml(name, email, phone || '', company || '', subject, message, now);

    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || "somatisme@gmail.com",
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      html: htmlContent,
    });

    auditLogger("EMAIL_SENT", { ip, email });
    res.json({ success: true, message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error("[ERROR] Contact form error:", error);
    auditLogger("ERROR", { ip: req.ip || "unknown", error: (error as Error).message });
    res.status(500).json({ error: "Erreur lors de l'envoi." });
  }
});

router.post("/send-order-email", async (req, res) => {
  try {
    const { orderForm, orderItems, cartTotal } = req.body;
    if (!orderForm || !orderForm.email || !orderItems || !cartTotal) {
      return res.status(400).json({ error: 'Informations de commande manquantes' });
    }
    // Logic can be expanded to save order to DB
    auditLogger("ORDER_RECEIVED", { email: orderForm.email, total: cartTotal, items: orderItems.length });
    res.json({ success: true, message: "Commande reçue." });
  } catch (error) {
    console.error("[ERROR] Order error:", error);
    auditLogger("ORDER_ERROR", { error: (error as Error).message });
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/test", (req, res) => res.json({ status: "API is working" }));

export default router;
