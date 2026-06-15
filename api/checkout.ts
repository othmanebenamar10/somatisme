import Stripe from 'stripe';
import { checkRateLimit, getClientIp, handleCors, sanitizePlainText, sendError } from './_lib/security';

export default async function handler(req: any, res: any) {
  const cors = handleCors(req, res, ['POST', 'OPTIONS']);
  if (!cors.ok) {
    return sendError(res, 403, 'Origin not allowed');
  }
  if (cors.preflight) {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Method not allowed');
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`checkout:${ip}`, 10, 60_000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return sendError(res, 429, 'Too many requests');
  }

  try {
    const { items, customerInfo } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'No items provided');
    }

    const customerEmail = sanitizePlainText(customerInfo?.email, 254).toLowerCase();
    if (!customerEmail) {
      return sendError(res, 400, 'Customer email required');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-03-25.dahlia' as any,
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'mad',
        product_data: {
          name: sanitizePlainText(item?.name, 200),
          description: sanitizePlainText(item?.description, 500),
        },
        unit_amount: Math.round(Number(item?.price || 0) * 100),
      },
      quantity: Math.max(1, Math.min(100, Number(item?.quantity || 1))),
    }));

    const appBaseUrl = process.env.PUBLIC_APP_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appBaseUrl}/products?payment=success`,
      cancel_url: `${appBaseUrl}/products?payment=cancelled`,
      customer_email: customerEmail,
      metadata: {
        customer_name: sanitizePlainText(customerInfo?.name, 100),
        customer_phone: sanitizePlainText(customerInfo?.phone, 20),
        customer_company: sanitizePlainText(customerInfo?.company, 150),
        customer_address: sanitizePlainText(customerInfo?.address, 200),
        customer_message: sanitizePlainText(customerInfo?.message, 500),
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error?.message || error);
    return sendError(res, 500, 'Erreur lors de la creation de la session de paiement.');
  }
}
