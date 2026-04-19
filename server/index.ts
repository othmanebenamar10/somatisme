import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API endpoint for contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, company, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Configure email transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || `"SOMATISME" <${process.env.SMTP_USER}>`,
        to: process.env.EMAIL_TO || "info@somatisme.ma",
        subject: `Nouvelle demande de contact: ${subject}`,
        html: `
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
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
