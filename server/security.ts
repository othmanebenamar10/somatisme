import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Military-grade security configuration
export const SECURITY_CONFIG = {
  // IP Whitelist and Blacklist
  TRUSTED_IPS: process.env.TRUSTED_IPS?.split(',').map(ip => ip.trim()) || [],
  BLOCKED_IPS: process.env.BLOCKED_IPS?.split(',').map(ip => ip.trim()) || [],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests per window
  
  // Security Headers
  CONTENT_SECURITY_POLICY: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  
  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  
  // Session Security
  SESSION_SECRET: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  SECURE_COOKIES: process.env.NODE_ENV === 'production',
  
  // API Security
  API_KEY: process.env.API_KEY || crypto.randomBytes(32).toString('hex'),
  API_KEY_HEADER: 'x-api-key',
  
  // Audit Logging
  ENABLE_AUDIT_LOGGING: process.env.ENABLE_AUDIT_LOGGING === 'true',
  AUDIT_LOG_FILE: process.env.AUDIT_LOG_FILE || './audit.log',
  
  // Path Protection
  PROTECTED_PATHS: [
    '/api',
    '/admin',
    '/invoice',
    '/dashboard'
  ],
  
  // Public Paths (no authentication required)
  PUBLIC_PATHS: [
    '/',
    '/contact',
    '/services',
    '/projects',
    '/products',
    '/privacy',
    '/terms'
  ]
};

// IP-based access control
export const ipAccessControl = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.socket.remoteAddress || '0.0.0.0';
  
  // Check if IP is blocked
  if (SECURITY_CONFIG.BLOCKED_IPS.includes(clientIP)) {
    console.warn(`[SECURITY] Blocked IP attempted access: ${clientIP}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Check if IP is in whitelist (if whitelist is configured)
  if (SECURITY_CONFIG.TRUSTED_IPS.length > 0 && !SECURITY_CONFIG.TRUSTED_IPS.includes(clientIP)) {
    console.warn(`[SECURITY] Untrusted IP attempted access: ${clientIP}`);
    return res.status(403).json({ error: 'Access denied - IP not whitelisted' });
  }
  
  next();
};

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW,
  max: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  frameguard: { action: 'deny' }
});

// API Key authentication middleware
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers[SECURITY_CONFIG.API_KEY_HEADER] as string;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  if (apiKey !== SECURITY_CONFIG.API_KEY) {
    console.warn(`[SECURITY] Invalid API key attempt from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Path protection middleware
export const pathProtection = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Check if path is protected
  const isProtected = SECURITY_CONFIG.PROTECTED_PATHS.some(protectedPath => 
    path.startsWith(protectedPath)
  );
  
  // Check if path is public
  const isPublic = SECURITY_CONFIG.PUBLIC_PATHS.some(publicPath => 
    path.startsWith(publicPath)
  );
  
  if (isProtected && !isPublic) {
    // For protected paths, require authentication
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token (implement your JWT verification here)
    // For now, we'll use a simple check
    if (!verifyToken(token)) {
      console.warn(`[SECURITY] Invalid token attempt from IP: ${req.ip} on path: ${path}`);
      return res.status(403).json({ error: 'Invalid authentication token' });
    }
  }
  
  next();
};

// Token verification (placeholder - implement proper JWT verification)
function verifyToken(token: string): boolean {
  // Implement proper JWT verification here
  // For now, return false to require proper implementation
  return false;
}

// Encryption utilities
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(SECURITY_CONFIG.ENCRYPTION_KEY, 'hex');
  const cipher = crypto.createCipheriv(SECURITY_CONFIG.ENCRYPTION_ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const key = Buffer.from(SECURITY_CONFIG.ENCRYPTION_KEY, 'hex');
  
  const decipher = crypto.createDecipheriv(SECURITY_CONFIG.ENCRYPTION_ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Audit logging
export const auditLogger = (action: string, details: any) => {
  if (SECURITY_CONFIG.ENABLE_AUDIT_LOGGING) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };
    
    console.log(`[AUDIT] ${JSON.stringify(logEntry)}`);
    
    // In production, write to file or database
    // fs.appendFileSync(SECURITY_CONFIG.AUDIT_LOG_FILE, JSON.stringify(logEntry) + '\n');
  }
};

// Request sanitizer
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  
  return input;
};

// CSRF Protection
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.headers['x-csrf-token'] as string;
  const sessionToken = req.session?.csrfToken;
  
  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    console.warn(`[SECURITY] CSRF token mismatch from IP: ${req.ip}`);
    return res.status(403).json({ error: 'CSRF token validation failed' });
  }
  
  next();
};

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Security middleware composition
export const securityMiddleware = [
  securityHeaders,
  rateLimiter,
  ipAccessControl,
  pathProtection
];

export default {
  SECURITY_CONFIG,
  ipAccessControl,
  rateLimiter,
  securityHeaders,
  apiKeyAuth,
  pathProtection,
  encrypt,
  decrypt,
  auditLogger,
  sanitizeInput,
  csrfProtection,
  generateCSRFToken,
  securityMiddleware
};
