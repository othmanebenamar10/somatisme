import { logApiRequest } from './_lib/security.js';

export default function handler(req: any, res: any) {
  logApiRequest(req, res);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
}
