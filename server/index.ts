try {
  process.loadEnvFile('.env');
} catch {
  // Environment variables may be supplied by the deployment platform.
}

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'node:crypto';

const { default: apiRouter } = await import('./routes/api');

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const staticPath = process.env.NODE_ENV === 'production'
  ? path.resolve(currentDirectory, 'public')
  : path.resolve(currentDirectory, '..', 'dist', 'public');

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://www.google.com/recaptcha/', 'https://www.gstatic.com/recaptcha/'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://www.google.com/recaptcha/', 'https://www.gstatic.com/recaptcha/', 'https:'],
      frameSrc: ["'self'", 'https://www.google.com/recaptcha/', 'https://recaptcha.google.com/', 'https://www.google.com/maps/', 'https://maps.google.com/'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));
app.use(express.json({ limit: '2mb', strict: true }));
app.use('/api', (req, res, next) => {
  const requestId = randomUUID();
  const startedAt = performance.now();
  res.setHeader('X-Request-ID', requestId);
  res.once('finish', () => {
    const status = res.statusCode;
    const entry = {
      timestamp: new Date().toISOString(),
      level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
      event: 'http.request',
      requestId,
      method: req.method,
      path: req.path,
      status,
      durationMs: Math.round(performance.now() - startedAt),
    };
    const write = status >= 500 ? console.error : status >= 400 ? console.warn : console.log;
    write(JSON.stringify(entry));
  });
  next();
});
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));
app.use('/api', apiRouter);
app.use(express.static(staticPath, {
  etag: true,
  maxAge: 0,
  immutable: false,
  index: false,
}));
app.get('*', (_req, res) => res.sendFile(path.join(staticPath, 'index.html')));

if (process.env.VERCEL !== '1') {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`Somatisme server listening on port ${port}`));
}

export default app;
