import { z } from 'zod';

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: Record<string, unknown>;
  socket?: { remoteAddress?: string };
};

type ApiResponse = {
  setHeader(name: string, value: string): ApiResponse;
  status(code: number): { json(data: unknown): void; end(): void };
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_PRODUCTION_ORIGINS = [
  'https://somatisme.vercel.app',
  'https://www.somatisme.ma',
  'https://somatisme.ma',
];

const DEFAULT_DEVELOPMENT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5173',
];

function normalizeOrigin(origin: string): string | null {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

export function getAllowedOrigins(): string[] {
  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeOrigin)
    .filter((value): value is string => Boolean(value));

  const vercelOrigin = process.env.VERCEL_URL
    ? normalizeOrigin(`https://${process.env.VERCEL_URL}`)
    : null;

  const baseline = process.env.NODE_ENV === 'production'
    ? DEFAULT_PRODUCTION_ORIGINS
    : [...DEFAULT_PRODUCTION_ORIGINS, ...DEFAULT_DEVELOPMENT_ORIGINS];

  return Array.from(new Set([...baseline, ...(vercelOrigin ? [vercelOrigin] : []), ...configured]));
}

export function getClientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

export function applySecurityHeaders(res: ApiResponse): void {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'
  );
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}

export function handleCors(
  req: ApiRequest,
  res: ApiResponse,
  allowedMethods: string[] = ['POST', 'OPTIONS']
): { ok: boolean; preflight: boolean } {
  applySecurityHeaders(res);
  res.setHeader('Vary', 'Origin');

  const requestOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  const allowedOrigins = getAllowedOrigins();
  const normalizedOrigin = requestOrigin ? normalizeOrigin(requestOrigin) : null;

  if (requestOrigin && (!normalizedOrigin || !allowedOrigins.includes(normalizedOrigin))) {
    return { ok: false, preflight: false };
  }

  if (normalizedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', normalizedOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');

  if (req.method === 'OPTIONS') {
    return { ok: true, preflight: true };
  }

  return { ok: true, preflight: false };
}

export function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60_000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function sendError(res: ApiResponse, status: number, message: string): void {
  res.status(status).json({ error: message });
}

export function sanitizePlainText(value: unknown, maxLen = 500): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLen);
}

export function sanitizeHeaderValue(value: unknown, maxLen = 200): string {
  return sanitizePlainText(value, maxLen).replace(/[\r\n]+/g, ' ').trim();
}

export function escapeHtml(value: unknown): string {
  const text = typeof value === 'string' ? value : String(value ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string' || email.length > 254) {
    return false;
  }

  if (/[\r\n]/.test(email)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') {
    return false;
  }

  return /^[\d\s\-+()]{7,20}$/.test(phone);
}

export function isLikelyBot(payload: Record<string, unknown>, minDurationMs: number): boolean {
  const honeypot = sanitizePlainText(payload.website ?? payload._honey ?? '', 200);
  if (honeypot) {
    return true;
  }

  const duration = typeof payload._duration === 'number'
    ? payload._duration
    : Number(payload._duration || 0);

  return Number.isFinite(duration) && duration > 0 && duration < minDurationMs;
}

export async function verifyRecaptcha(
  token: string | null | undefined,
  minScore = 0.5
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    return true;
  }

  if (!token || typeof token !== 'string' || token.length > 2048) {
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json() as {
      success?: boolean;
      score?: number;
      action?: string;
    };

    return data.success === true && (data.score ?? 1) >= minScore;
  } catch {
    return false;
  }
}

export function isSafePdfBase64(pdfBase64: unknown, maxBytes = 1_500_000): boolean {
  if (typeof pdfBase64 !== 'string' || pdfBase64.length === 0) {
    return false;
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(pdfBase64)) {
    return false;
  }

  const approxBytes = Math.floor((pdfBase64.length * 3) / 4);
  if (approxBytes > maxBytes) {
    return false;
  }

  try {
    const prefix = Buffer.from(pdfBase64.slice(0, 64), 'base64').toString('utf8');
    return prefix.startsWith('%PDF-');
  } catch {
    return false;
  }
}

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().min(3).max(254),
  phone: z.string().max(20).optional().default(''),
  company: z.string().max(150).optional().default(''),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  recaptchaToken: z.string().max(2048).optional().nullable(),
});

export const orderSchema = z.object({
  orderForm: z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(3).max(254),
    phone: z.string().min(7).max(20),
    company: z.string().max(150).optional().default(''),
    address: z.string().max(200).optional().default(''),
    message: z.string().max(1000).optional().default(''),
  }),
  orderItems: z.array(z.object({
    name: z.string().min(1).max(200),
    price: z.number().finite().min(0).max(10_000_000),
    quantity: z.number().int().min(1).max(100).optional().default(1),
  })).min(1).max(50),
  cartTotal: z.number().finite().positive().max(10_000_000),
  pdfBase64: z.string().optional(),
  invoiceNumber: z.string().min(1).max(60),
  recaptchaToken: z.string().max(2048).optional().nullable(),
});
