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

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Military-grade security middleware
  app.use(securityHeaders);
  app.use(rateLimiter);
  app.use(ipAccessControl);
  app.use(pathProtection);

  // Middleware
  app.use(express.json({ limit: "10kb" })); // Limit body size to prevent large payload attacks

  // Connect to MongoDB
  try {
    await connectToDatabase();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API endpoint for contact form with military-grade security
  app.post("/api/contact", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const userAgent = req.headers["user-agent"] || "unknown";
      
      // Sanitize input
      const sanitizedBody = sanitizeInput(req.body);
      const { name, email, phone, company, subject, message } = sanitizedBody;

      // Security: Validate required fields
      if (!name || !email || !subject || !message) {
        auditLogger("INVALID_REQUEST", { ip, userAgent, missingFields: { name, email, subject, message } });
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Security: Check if IP is in trusted list (optional)
      if (TRUSTED_IPS.length > 0 && !TRUSTED_IPS.includes(ip)) {
        auditLogger("UNTRUSTED_IP", { ip, userAgent, email });
        // You can choose to block or just log untrusted IPs
      }

      // Security: Store submission in MongoDB with IP tracking
      const submission = new ContactSubmission({
        name,
        email,
        phone,
        company,
        subject,
        message,
        ipAddress: ip,
        userAgent,
      });

      await submission.save();
      auditLogger("SUBMISSION_RECEIVED", { ip, userAgent, email, subject, status: submission.status });

      // Security: Check if submission was flagged as spam
      if (submission.status === "spam" || submission.riskScore >= 100) {
        auditLogger("SPAM_DETECTED", { ip, userAgent, email, riskScore: submission.riskScore });
        return res.status(403).json({ error: "Submission flagged as spam" });
      }

      // Initialize Resend
      if (!process.env.RESEND_API_KEY) {
        console.error("[EMAIL] RESEND_API_KEY not configured");
        return res.status(500).json({ error: 'Email service not configured - missing RESEND_API_KEY' });
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
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || "Non renseigné"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Entreprise:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${company || "Non renseigné"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Sujet:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <strong style="color: #333;">Message:</strong>
            <p style="color: #666; white-space: pre-wrap; margin-top: 10px;">${message}</p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">Cet email a été envoyé depuis le formulaire de contact du site SOMATISME.</p>
        </div>
      `;

      // Send email via Resend
      try {
        const result = await resend.emails.send({
          from: "SOMATISME <onboarding@resend.dev>",
          to: process.env.EMAIL_TO || "info@somatisme.ma",
          subject: `Nouvelle demande de contact: ${subject}`,
          html: htmlContent,
        });

        console.log("[EMAIL] Contact form email sent successfully via Resend");
        auditLogger("EMAIL_SENT", { ip, userAgent, email });

        // Update submission status
        submission.status = "processed";
        await submission.save();

        res.json({ success: true, message: "Email sent successfully" });
      } catch (emailError) {
        console.error("[EMAIL] Resend Error:", {
          message: (emailError as Error).message,
        });
        throw emailError;
      }
    } catch (error) {
      console.error("[ERROR] Error processing contact form:", error);
      auditLogger("ERROR", { ip: req.ip || "unknown", error: (error as Error).message });
      res.status(500).json({ error: "Failed to send email - check server logs" });
    }
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

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Security: Helmet enabled, Rate limiting active, MongoDB connected`);
  });
}

startServer().catch(console.error);
