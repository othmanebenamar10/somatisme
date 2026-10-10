try { process.loadEnvFile('.env'); } catch { /* .env not found, use system env */ }
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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
import apiRouter from "./routes/api";

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

  // API Routes
  app.use("/api", apiRouter);

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
