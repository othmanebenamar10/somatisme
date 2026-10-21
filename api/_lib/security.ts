import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import { Redis } from '@upstash/redis';

type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  body?: Record<string, unknown>;
  socket?: { remoteAddress?: string };
};

type ApiResponse = {
  setHeader(name: string, value: string): ApiResponse;
  status(code: number): { json(data: unknown): void; end(): void };
};

let redisClient: Redis | undefined;

export function getRedis(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error('Upstash Redis is not configured');
    }
    redisClient = new Redis({ url, token });
  }
  return redisClient;
}

const DEFAULT_PRODUCTION_ORIGINS = [
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
  const production = process.env.NODE_ENV === 'production';
  if (production) return DEFAULT_PRODUCTION_ORIGINS;

  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeOrigin)
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set([
    ...DEFAULT_PRODUCTION_ORIGINS,
    ...DEFAULT_DEVELOPMENT_ORIGINS,
    ...configured,
  ]));
}

export function getClientIp(req: ApiRequest): string {
  // Express resolves req.ip using its configured trusted proxy chain. Prefer
  // that value so an arbitrary X-Forwarded-For header cannot choose the key.
  if (typeof req.ip === 'string' && isIP(req.ip)) {
    return req.ip;
  }

  // Vercel overwrites X-Forwarded-For with the connecting client IP. Only trust
  // this header in that deployment environment; on other hosts, use the socket.
  if (process.env.VERCEL === '1') {
    const forwarded = req.headers['x-forwarded-for'];
    const candidate = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : Array.isArray(forwarded) && forwarded[0]
        ? forwarded[0].split(',')[0].trim()
        : '';
    if (isIP(candidate)) return candidate;
  }

  const remoteAddress = req.socket?.remoteAddress;
  if (remoteAddress && isIP(remoteAddress)) return remoteAddress;
  return 'unknown';
}

/** Logs metadata only; request bodies and query strings may contain personal data. */
export function logApiRequest(req: any, res: any): void {
  if (typeof res.getHeader === 'function' && res.getHeader('X-Request-ID')) return;

  const requestId = randomUUID();
  const startedAt = Date.now();
  res.setHeader?.('X-Request-ID', requestId);
  res.once?.('finish', () => {
    const status = Number(res.statusCode || 200);
    const entry = {
      timestamp: new Date().toISOString(),
      level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
      event: 'http.request',
      requestId,
      method: String(req.method || 'UNKNOWN'),
      path: String(req.url || '/').split('?')[0],
      status,
      durationMs: Date.now() - startedAt,
    };
    const write = status >= 500 ? console.error : status >= 400 ? console.warn : console.log;
    write(JSON.stringify(entry));
  });
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

  if (!requestOrigin || !normalizedOrigin || !allowedOrigins.includes(normalizedOrigin)) {
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

export async function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60_000
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const result = await getRedis().eval<[string], [number, number]>(
    `local count = redis.call('INCR', KEYS[1])
     if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
     return {count, redis.call('PTTL', KEYS[1])}`,
    [`somatisme:rate-limit:${key}`],
    [String(windowMs)],
  );
  const [count, ttlMs] = result;
  return {
    allowed: count <= maxRequests,
    retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
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

  const digits = phone.replace(/\D/g, '');
  return /^[\d\s\-+().]{7,24}$/.test(phone) && digits.length >= 7 && digits.length <= 15;
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
  minScore = 0.5,
  expectedAction?: string
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    return false;
  }

  if (!token || typeof token !== 'string' || token.length > 2048) {
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json() as {
      success?: boolean;
      score?: number;
      action?: string;
    };

    return data.success === true
      && (data.score ?? 1) >= minScore
      && (!expectedAction || data.action === expectedAction);
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
    productId: z.string().min(1).max(40),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
  cartTotal: z.number().finite().positive().max(10_000_000),
  pdfBase64: z.string().optional(),
  invoiceNumber: z.string().min(1).max(60),
  recaptchaToken: z.string().max(2048).optional().nullable(),
});
