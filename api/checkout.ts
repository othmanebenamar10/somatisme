import Stripe from 'stripe';

const _rl = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const e = _rl.get(ip);
  if (!e || now > e.resetAt) { _rl.set(ip, { count: 1, resetAt: now + windowMs }); return true; }
  if (e.count >= max) return false;
  e.count++; return true;
}
function getIp(req: any): string {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' ? fwd.split(',')[0].trim() : null) || req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: any, res: any) {
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://somatisme.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getIp(req);
  if (!rateLimit(ip)) return res.status(429).json({ error: 'Too many requests' });

  try {
    const { items, customerInfo } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    if (!customerInfo || !customerInfo.email) {
      return res.status(400).json({ error: 'Customer email required' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-03-25.dahlia' as any,
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'mad',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'http://localhost:5173'}/products?payment=success`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:5173'}/products?payment=cancelled`,
      customer_email: customerInfo.email,
      metadata: {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_company: customerInfo.company || '',
        customer_address: customerInfo.address || '',
        customer_message: customerInfo.message || '',
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la session de paiement.' });
  }
}
