import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { getProductById } from '../shared/products.js';
import { checkRateLimit, getAllowedOrigins, getClientIp, handleCors, isValidEmail, logApiRequest, sanitizePlainText, sendError } from './_lib/security.js';

export default async function handler(req: any, res: any) {
  logApiRequest(req, res);
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

  const contentLength = Number.parseInt(String(req.headers['content-length'] || '0'), 10);
  if (contentLength > 50_000) return sendError(res, 413, 'Request too large');

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`checkout:${ip}`, 10, 60_000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return sendError(res, 429, 'Too many requests');
  }

  try {
    const { items, customerInfo, requestId } = req.body || {};

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return sendError(res, 400, 'No items provided');
    }

    const customerEmail = sanitizePlainText(customerInfo?.email, 254).toLowerCase();
    if (!isValidEmail(customerEmail)) {
      return sendError(res, 400, 'Customer email required');
    }

    const quantitiesByProduct = new Map<string, number>();
    for (const item of items) {
      const id = sanitizePlainText(item?.productId, 40);
      quantitiesByProduct.set(id, (quantitiesByProduct.get(id) || 0) + Number(item?.quantity));
    }

    const verifiedItems = items.map((item: any) => {
      const product = getProductById(sanitizePlainText(item?.productId, 40));
      const quantity = Number(item?.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || (quantitiesByProduct.get(product.id) || 0) > product.stock) return null;
      return { product, quantity };
    });
    if (verifiedItems.some((item) => item === null)) {
      return sendError(res, 400, 'Produit indisponible ou quantité invalide');
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return sendError(res, 503, 'Le paiement en ligne est temporairement indisponible.');
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = verifiedItems.map((entry) => {
      const { product, quantity } = entry!;
      return ({
      price_data: {
        currency: 'mad',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity,
    });
    });

    const subtotal = verifiedItems.reduce((sum, entry) => sum + entry!.product.price * entry!.quantity, 0);
    const shippingFee = Math.round(subtotal * 0.02);
    const tax = Math.round(subtotal * 0.2);
    if (shippingFee > 0) {
      lineItems.push({
        price_data: { currency: 'mad', product_data: { name: 'Frais de livraison et de gestion' }, unit_amount: shippingFee * 100 },
        quantity: 1,
      });
    }
    if (tax > 0) {
      lineItems.push({
        price_data: { currency: 'mad', product_data: { name: 'TVA (20 %)' }, unit_amount: tax * 100 },
        quantity: 1,
      });
    }

    const appBaseUrl = process.env.PUBLIC_APP_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
    let appOrigin: string;
    try {
      appOrigin = new URL(appBaseUrl).origin;
    } catch {
      return sendError(res, 500, 'URL publique du site invalide');
    }
    if (!getAllowedOrigins().includes(appOrigin)) {
      return sendError(res, 500, 'URL publique du site non autorisée');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appOrigin}/products?payment=success`,
      cancel_url: `${appOrigin}/products?payment=cancelled`,
      customer_email: customerEmail,
      metadata: {
        customer_name: sanitizePlainText(customerInfo?.name, 100),
        customer_phone: sanitizePlainText(customerInfo?.phone, 20),
        customer_company: sanitizePlainText(customerInfo?.company, 150),
        customer_address: sanitizePlainText(customerInfo?.address, 200),
        customer_message: sanitizePlainText(customerInfo?.message, 500),
      },
    }, {
      idempotencyKey: typeof requestId === 'string' && /^[\w-]{16,100}$/.test(requestId)
        ? requestId
        : randomUUID(),
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error?.message || error);
    return sendError(res, 500, 'Erreur lors de la creation de la session de paiement.');
  }
}
