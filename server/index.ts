import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Resend } from "resend";
import { connectToDatabase } from "./db";
import ContactSubmission from "./models/ContactSubmission";
import {
  securityHeaders,
  rateLimiter,
  ipAccessControl,
  apiKeyAuth,
  pathProtection,
  sanitizeInput,
  auditLogger
} from "./security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security: IP whitelist (add trusted IPs here)
const TRUSTED_IPS = process.env.TRUSTED_IPS?.split(",") || [];
const BLOCKED_IPS = process.env.BLOCKED_IPS?.split(",") || [];

// Security: Audit logging function
function logAudit(action: string, ip: string, details: any): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    ip,
    details,
  };
  console.log("[AUDIT]", JSON.stringify(logEntry));
  
  // In production, you might want to send this to a secure logging service
  // or store in a separate audit collection in MongoDB
}

const app = express();

// Military-grade security middleware
app.use(securityHeaders);
app.use(rateLimiter);
app.use(ipAccessControl);
app.use(pathProtection);

// Middleware
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent large payload attacks

// Serve static files from dist/public in production
const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

app.use(express.static(staticPath));

// Initialize database connection (optional - won't block startup)
connectToDatabase().catch(error => {
  console.error("Failed to connect to database:", error);
});

  // API endpoint for contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const ip = req.ip || req.socket?.remoteAddress || "unknown";
      const sanitizedBody = sanitizeInput(req.body);
      const { name, email, phone, company, subject, message } = sanitizedBody;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("[EMAIL] SMTP_USER or SMTP_PASS not configured");
        return res.status(500).json({ error: "Email service unavailable - configure SMTP_USER and SMTP_PASS in .env" });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const htmlContent = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2 style="color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:10px">Nouvelle demande de contact — SOMATISME</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Nom</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Téléphone</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${phone || "Non renseigné"}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Entreprise</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${company || "Non renseigné"}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee"><strong>Sujet</strong></td><td style="padding:8px;border-bottom:1px solid #eee">${subject}</td></tr>
          </table>
          <div style="margin-top:20px;padding:15px;background:#f8fafc;border-radius:8px">
            <strong>Message :</strong>
            <p style="color:#475569;white-space:pre-wrap;margin-top:8px">${message}</p>
          </div>
        </div>`;

      await transporter.sendMail({
        from: `"SOMATISME" <${process.env.SMTP_USER}>`,
        to: process.env.EMAIL_TO || "info@somatisme.ma",
        replyTo: email,
        subject: `[Contact] ${subject} — ${name}`,
        html: htmlContent,
      });

      console.log("[EMAIL] Contact email sent to", process.env.EMAIL_TO || "info@somatisme.ma");
      auditLogger("EMAIL_SENT", { ip, email });
      res.json({ success: true, message: "Votre message a été envoyé avec succès !" });
    } catch (error) {
      console.error("[ERROR] Contact form error:", error);
      auditLogger("ERROR", { ip: req.ip || "unknown", error: (error as Error).message });
      res.status(500).json({ error: "Erreur lors de l'envoi. Vérifiez les logs serveur." });
    }
  });

  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ status: "API is working" });
  });

  // API endpoint for sending order confirmation emails
  app.post("/api/send-order-email", async (req, res) => {
    console.log("[ORDER] Received order request");
    try {
      const { orderForm, orderItems, cartTotal } = req.body;

      console.log("[ORDER] Order data:", { 
        hasOrderForm: !!orderForm, 
        hasOrderItems: !!orderItems, 
        hasCartTotal: !!cartTotal,
        itemsCount: orderItems?.length,
        total: cartTotal
      });

      if (!orderForm || !orderForm.email || !orderItems || !cartTotal) {
        console.error("[ORDER] Missing required fields");
        return res.status(400).json({ error: 'Missing required order information' });
      }

      // Order received - WhatsApp notification will be sent from client side
      console.log("[ORDER] Order received successfully:", { email: orderForm.email, total: cartTotal, items: orderItems.length });
      auditLogger("ORDER_RECEIVED", { email: orderForm.email, total: cartTotal, items: orderItems.length });

      // Return success - WhatsApp notification is sent from client side
      res.json({ success: true, message: "Commande reçue. Vous recevrez une confirmation par WhatsApp." });
    } catch (error) {
      console.error("[ERROR] Error processing order:", error);
      auditLogger("ORDER_ERROR", { error: (error as Error).message });
      res.status(500).json({ error: "Erreur lors du traitement de la commande" });
    }
  });

// Handle client-side routing - serve index.html for all routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Start server only if not in Vercel environment
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3000;
  const server = createServer(app);
  
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Security: Helmet enabled, Rate limiting active`);
  });
}

// Export app for Vercel
export default app;
