import { logApiRequest } from './_lib/security.js';

export default function handler(req: any, res: any) {
  logApiRequest(req, res);
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
}
