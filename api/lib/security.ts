/**
 * Shared security utilities for Vercel serverless API functions
 */
import type { NextApiRequest, NextApiResponse } from 'next';

// ── In-memory rate limiter (per function instance) ──────────────────────────
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count++;
  return true;
}

// ── HTML entity escaping (prevents XSS in email templates) ──────────────────
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ── Strip control characters and truncate to max length ─────────────────────
export function sanitizeString(str: unknown, maxLen = 500): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
    .replace(/[\r\n]{3,}/g, '\n\n')                      // collapse excess newlines
    .trim()
    .slice(0, maxLen);
}

// ── Email format validation ──────────────────────────────────────────────────
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

// ── Phone format validation ──────────────────────────────────────────────────
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}

// ── Get real client IP ───────────────────────────────────────────────────────
export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

// ── CORS headers for own domain only ────────────────────────────────────────
export function setCorsHeaders(res: NextApiResponse): void {
  const allowed = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://somatisme.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Generic secure error response (never expose internals) ──────────────────
export function sendError(
  res: NextApiResponse,
  status: number,
  message: string
): void {
  res.status(status).json({ error: message });
}

// ── Google reCAPTCHA v3 server-side verification ─────────────────────────────
export async function verifyRecaptcha(
  token: string | null | undefined,
  minScore = 0.5
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  // If key not configured, skip silently (graceful degradation)
  if (!secretKey) return true;
  if (!token || typeof token !== 'string' || token.length > 2048) return false;

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      { method: 'POST' }
    );
    const data = await response.json();
    // data.score: 1.0 = human, 0.0 = bot
    return data.success === true && (data.score ?? 1) >= minScore;
  } catch (err) {
    console.error('[RECAPTCHA] Verification error:', err);
    return false;
  }
}
