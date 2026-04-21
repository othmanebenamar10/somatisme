import nodemailer from 'nodemailer';

// ── Inline utilities (no relative imports for Vercel compatibility) ──────────

const _rateLimitStore = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = _rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) { _rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs }); return true; }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

function escapeHtml(str: unknown): string {
  if (str == null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function sanitizeString(str: unknown, maxLen = 500): string {
  if (str == null) return '';
  return String(str).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,'').replace(/[\r\n]{3,}/g,'\n\n').trim().slice(0, maxLen);
}

function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}

function getClientIp(req: any): string {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' ? fwd.split(',')[0].trim() : null) || req.socket?.remoteAddress || 'unknown';
}

function setCorsHeaders(res: any): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendError(res: any, status: number, message: string): void {
  res.status(status).json({ error: message });
}

async function verifyRecaptcha(token: string | null | undefined, minScore = 0.5): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  try {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await r.json() as { success: boolean; score?: number };
    return data.success === true && (data.score ?? 1) >= minScore;
  } catch { return false; }
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

  // Body size guard: PDF base64 can be large, cap at 2 MB
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 2_000_000) return sendError(res, 413, 'Request too large');

  // Rate limiting: 5 orders / 5 minutes per IP
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, 5, 300_000)) {
    return sendError(res, 429, 'Too many requests. Please wait before trying again.');
  }

  try {
    const body = req.body || {};

    // Validate and sanitize orderForm fields
    const name    = sanitizeString(body.orderForm?.name, 100);
    const email   = sanitizeString(body.orderForm?.email, 254);
    const phone   = sanitizeString(body.orderForm?.phone, 20);
    const company = sanitizeString(body.orderForm?.company, 150);
    const address = sanitizeString(body.orderForm?.address, 200);
    const message = sanitizeString(body.orderForm?.message, 1000);

    if (!name || !email || !phone) {
      return sendError(res, 400, 'Informations client manquantes');
    }
    if (!isValidEmail(email)) {
      return sendError(res, 400, 'Adresse email invalide');
    }
    if (phone && !isValidPhone(phone)) {
      return sendError(res, 400, 'Numéro de téléphone invalide');
    }

    // Validate orderItems
    const rawItems = body.orderItems;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return sendError(res, 400, 'Aucun produit dans la commande');
    }
    if (rawItems.length > 50) {
      return sendError(res, 400, 'Trop de produits dans la commande');
    }

    // Sanitize each item
    const orderItems = rawItems.map((item: any) => ({
      name:  sanitizeString(item?.name, 200),
      price: Number(item?.price) || 0,
    })).filter(item => item.name);

    const cartTotal = Number(body.cartTotal) || 0;
    if (cartTotal <= 0) return sendError(res, 400, 'Total de commande invalide');

    // Honeypot: if filled, it's a bot
    if (body.website || body._honey) {
      console.warn('[SECURITY] Honeypot triggered from IP:', ip);
      return res.status(200).json({ success: true }); // Silent reject
    }

    // Timing check: form submitted in < 1.5s is almost certainly a bot
    const submitDuration = Number(body._duration) || 99999;
    if (submitDuration < 1500) {
      console.warn('[SECURITY] Timing bot detected from IP:', ip, `(${submitDuration}ms)`);
      return res.status(200).json({ success: true }); // Silent reject
    }

    // reCAPTCHA v3 verification
    const recaptchaToken = sanitizeString(body.recaptchaToken, 2048);
    const isHuman = await verifyRecaptcha(recaptchaToken, 0.5);
    if (!isHuman) {
      console.warn('[SECURITY] reCAPTCHA failed from IP:', ip);
      return sendError(res, 403, 'Verification de securite echouee. Veuillez reessayer.');
    }

    const pdfBase64    = typeof body.pdfBase64 === 'string' ? body.pdfBase64 : null;
    const invoiceNumber = sanitizeString(body.invoiceNumber, 60);

    const orderForm = { name, email, phone, company, address, message };

    // Validate SMTP config
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[EMAIL] SMTP_USER or SMTP_PASS not configured');
      return sendError(res, 500, 'Email service unavailable');
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

    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const orderNumber = `CMD-${Date.now().toString().slice(-6)}`;

    // Escape all user data before inserting into HTML
    const safeName    = escapeHtml(orderForm.name);
    const safeEmail   = escapeHtml(orderForm.email);
    const safePhone   = escapeHtml(orderForm.phone);
    const safeCompany = escapeHtml(orderForm.company);
    const safeMessage = escapeHtml(orderForm.message);
    const safeInvoice = escapeHtml(invoiceNumber);
    const safeOrderNumber = escapeHtml(orderNumber);
    // Email subjects: strip newlines to prevent header injection
    const customerSubject = `Confirmation de votre commande SOMATISME - ${safeInvoice}`.replace(/[\r\n]/g, '');
    const adminSubject    = `NOUVELLE COMMANDE - ${safeName} - ${safeInvoice}`.replace(/[\r\n]/g, '');

    // Customer email HTML - bright/light professional style
    const customerHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#0e7490 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <div style="background:rgba(6,182,212,0.2);border:1px solid rgba(6,182,212,0.4);border-radius:12px;display:inline-block;padding:8px 20px;margin-bottom:20px;">
            <span style="color:#67e8f9;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">SOMATISME</span>
          </div>
          <div style="width:64px;height:64px;background:rgba(6,182,212,0.2);border:2px solid #06b6d4;border-radius:50%;margin:0 auto 16px;line-height:64px;text-align:center;">
            <span style="font-size:28px;">✅</span>
          </div>
          <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;">Commande Confirmée !</h1>
          <p style="color:#94a3b8;font-size:14px;margin:0;">R&#233;f: <strong style="color:#06b6d4;">${safeOrderNumber}</strong> &nbsp;&bull;&nbsp; ${date}</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="color:#1e293b;font-size:16px;margin:0 0 24px;">Bonjour <strong>${safeName}</strong>,</p>
          <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 30px;">Merci pour votre commande ! Nous avons bien reçu votre demande et notre équipe vous contactera dans les <strong>24 heures</strong> pour confirmer la livraison.</p>

          <!-- Order items -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
            <div style="background:#1e3a5f;padding:14px 20px;">
              <p style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0;">🛒 Produits Commandés</p>
            </div>
            <div style="padding:20px;">
              ${orderItems.map((item: any, idx: number) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f1f5f9;">
                <div>
                  <p style="color:#1e293b;font-size:14px;font-weight:600;margin:0;">${idx + 1}. ${escapeHtml(item.name)}</p>
                </div>
                <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px;padding:4px 12px;">
                  <span style="color:#0e7490;font-size:14px;font-weight:700;">${Number(item.price)} MAD</span>
                </div>
              </div>`).join('')}
              <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0 0;">
                <p style="color:#1e293b;font-size:16px;font-weight:700;margin:0;">TOTAL</p>
                <p style="color:#0e7490;font-size:22px;font-weight:800;margin:0;">${Number(cartTotal)} MAD</p>
              </div>
            </div>
          </div>

          <!-- Info boxes -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="33%" style="padding:0 6px 0 0;">
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;text-align:center;">
                  <p style="font-size:20px;margin:0 0 4px;">🚚</p>
                  <p style="color:#166534;font-size:11px;font-weight:700;margin:0;">Livraison</p>
                  <p style="color:#15803d;font-size:10px;margin:4px 0 0;">Confirmée sous 24h</p>
                </div>
              </td>
              <td width="33%" style="padding:0 3px;">
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;text-align:center;">
                  <p style="font-size:20px;margin:0 0 4px;">💳</p>
                  <p style="color:#1e40af;font-size:11px;font-weight:700;margin:0;">Paiement</p>
                  <p style="color:#1d4ed8;font-size:10px;margin:4px 0 0;">À la livraison</p>
                </div>
              </td>
              <td width="33%" style="padding:0 0 0 6px;">
                <div style="background:#fdf4ff;border:1px solid #e9d5ff;border-radius:10px;padding:14px;text-align:center;">
                  <p style="font-size:20px;margin:0 0 4px;">📞</p>
                  <p style="color:#6b21a8;font-size:11px;font-weight:700;margin:0;">Support</p>
                  <p style="color:#7e22ce;font-size:10px;margin:4px 0 0;">+212 679 825 646</p>
                </div>
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#1e293b;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
          <p style="color:#64748b;font-size:12px;margin:0 0 4px;">SOMATISME — Automatisation Industrielle</p>
          <p style="color:#475569;font-size:11px;margin:0;">Rue Résistance Nassime GH12 Appt 1, Mohammedia • info@somatisme.ma • +212 679 825 646</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Admin email HTML - dark professional style
    const adminHtml = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#0e7490 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <div style="background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);border-radius:12px;display:inline-block;padding:8px 20px;margin-bottom:16px;">
            <span style="color:#06b6d4;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">SOMATISME</span>
          </div>
          <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;">🔔 Nouvelle Commande</h1>
          <div style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.4);border-radius:20px;display:inline-block;padding:4px 16px;margin-top:8px;">
            <span style="color:#fca5a5;font-size:12px;font-weight:700;">ACTION REQUISE</span>
          </div>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#1e293b;padding:40px;">

          <!-- Order ref -->
          <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.25);border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Référence commande</p>
            <p style="color:#06b6d4;font-size:20px;font-weight:800;margin:0;letter-spacing:2px;">${safeOrderNumber}</p>
            <p style="color:#64748b;font-size:12px;margin:4px 0 0;">${date}</p>
          </div>

          <!-- Client info -->
          <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">👤 Informations Client</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="50%" style="padding:0 8px 12px 0;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Nom</p>
                  <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">${safeName}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 12px 8px;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Téléphone</p>
                  <p style="color:#06b6d4;font-size:14px;font-weight:600;margin:0;">${safePhone}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding:0 8px 0 0;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Email</p>
                  <p style="color:#06b6d4;font-size:14px;font-weight:600;margin:0;">${safeEmail}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 0 8px;">
                <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;">
                  <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Entreprise</p>
                  <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0;">${safeCompany || '—'}</p>
                </div>
              </td>
            </tr>
          </table>

          <!-- Products -->
          <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">🛒 Produits Commandés</p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;overflow:hidden;margin-bottom:28px;">
            ${orderItems.map((item: any, idx: number) => `
            <div style="padding:14px 18px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;">
              <span style="color:#cbd5e1;font-size:14px;">${idx + 1}. ${escapeHtml(item.name)}</span>
              <span style="color:#06b6d4;font-size:14px;font-weight:700;">${Number(item.price)} MAD</span>
            </div>`).join('')}
            <div style="padding:16px 18px;background:#0c1929;display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#94a3b8;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Total</span>
              <span style="color:#06b6d4;font-size:24px;font-weight:800;">${Number(cartTotal)} MAD</span>
            </div>
          </div>

          ${orderForm.message ? `
          <!-- Message -->
          <div style="background:#0f172a;border:1px solid #334155;border-left:3px solid #06b6d4;border-radius:10px;padding:16px 18px;margin-bottom:28px;">
            <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Message du client</p>
            <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0;">${safeMessage}</p>
          </div>` : ''}

          <!-- CTA -->
          <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px 20px;text-align:center;">
            <p style="color:#fca5a5;font-size:13px;font-weight:600;margin:0;">⚡ Contacter le client dans les 24 heures pour confirmer la commande</p>
          </div>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="color:#334155;font-size:12px;margin:0 0 4px;">SOMATISME — Automatisation Industrielle</p>
          <p style="color:#334155;font-size:11px;margin:0;">Rue Résistance Nassime GH12 Appt 1, Mohammedia • info@somatisme.ma • +212 679 825 646</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // PDF attachment config
    const attachments = pdfBase64 ? [{
      filename: `Facture_${invoiceNumber || Date.now()}_SOMATISME.pdf`,
      content: pdfBase64,
      encoding: 'base64',
      contentType: 'application/pdf',
    }] : [];

    // Send customer email via SMTP Gmail with PDF
    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: orderForm.email,
      subject: customerSubject,
      html: customerHtml,
      attachments,
    });
    console.log('[EMAIL] Customer order email sent via SMTP Gmail');

    await transporter.sendMail({
      from: `"SOMATISME" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || process.env.SMTP_USER,
      subject: adminSubject,
      html: adminHtml,
      attachments,
    });
    console.log('[EMAIL] Admin order email sent via SMTP Gmail');

    return res.status(200).json({ success: true, message: 'Commande recue. Confirmation envoyee par email.' });
  } catch (error) {
    console.error('[ERROR] Order email error:', error);
    return sendError(res, 500, 'Une erreur est survenue lors du traitement de votre commande.');
  }
}
