try { process.loadEnvFile('.env'); } catch { /* .env not found, use system env */ }
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

      const now = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca', dateStyle: 'full', timeStyle: 'short' });
      const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#1e40af 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center">
          <div style="display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:10px 24px;margin-bottom:16px">
            <span style="color:#60a5fa;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase">SOMATISME</span>
          </div>
          <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px">Nouvelle demande de contact</h1>
          <p style="margin:0;color:#93c5fd;font-size:14px">${now}</p>
        </td></tr>

        <!-- ALERT BANNER -->
        <tr><td style="background:#1e40af;padding:14px 40px;text-align:center">
          <p style="margin:0;color:#bfdbfe;font-size:13px">
            ⚡ <strong style="color:#fff">Action requise</strong> — Un prospect vous a contacté via le site web
          </p>
        </td></tr>

        <!-- CONTACT INFO -->
        <tr><td style="background:#1e293b;padding:32px 40px">
          <h2 style="margin:0 0 20px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">Informations du contact</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding:0 8px 16px 0;vertical-align:top">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Nom</p>
                  <p style="margin:0;color:#f1f5f9;font-size:15px;font-weight:600">${name}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 16px 8px;vertical-align:top">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Email</p>
                  <p style="margin:0;color:#60a5fa;font-size:15px;font-weight:600">${email}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding:0 8px 16px 0;vertical-align:top">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Téléphone</p>
                  <p style="margin:0;color:#f1f5f9;font-size:15px;font-weight:600">${phone || '<span style="color:#475569;font-style:italic">Non renseigné</span>'}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 16px 8px;vertical-align:top">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Entreprise</p>
                  <p style="margin:0;color:#f1f5f9;font-size:15px;font-weight:600">${company || '<span style="color:#475569;font-style:italic">Non renseignée</span>'}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding:0 0 0 0">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px">
                  <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Sujet</p>
                  <p style="margin:0;color:#fbbf24;font-size:15px;font-weight:600">${subject}</p>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- MESSAGE -->
        <tr><td style="background:#1e293b;padding:0 40px 32px">
          <h2 style="margin:0 0 12px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">Message</h2>
          <div style="background:#0f172a;border:1px solid #334155;border-left:4px solid #3b82f6;border-radius:0 10px 10px 0;padding:20px 24px">
            <p style="margin:0;color:#cbd5e1;font-size:15px;line-height:1.7;white-space:pre-wrap">${message}</p>
          </div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#1e293b;padding:0 40px 32px;text-align:center">
          <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px">
            ✉ Répondre à ${name}
          </a>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0f172a;border-top:1px solid #1e293b;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center">
          <p style="margin:0 0 4px;color:#475569;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">SOMATISME</p>
          <p style="margin:0;color:#334155;font-size:11px">Automatisation Industrielle • Mohammedia, Maroc</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

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
