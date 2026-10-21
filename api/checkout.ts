import Stripe from 'stripe';
import { z } from 'zod';
import { getProductById } from './_lib/products.js';
import { calculateOrderTotals } from './_lib/pricing.js';
import {
  checkRateLimit,
  getAllowedOrigins,
  getClientIp,
  handleCors,
  isValidEmail,
  isValidPhone,
  logApiRequest,
  sanitizePlainText,
  sendError,
  verifyRecaptcha,
} from './_lib/security.js';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1).max(40),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
  customerInfo: z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(3).max(254),
    phone: z.string().min(7).max(24),
    company: z.string().max(150).optional().default(''),
    address: z.string().max(200).optional().default(''),
    message: z.string().max(500).optional().default(''),
  }),
  recaptchaToken: z.string().max(2048).optional(),
  requestId: z.string().regex(/^[\w-]{16,100}$/).optional(),
});

type CheckoutLineItem = {
  price_data: {
    currency: 'mad';
    product_data: { name: string; description?: string; metadata?: Record<string, string> };
    unit_amount: number;
  };
  quantity: number;
};

export default async function handler(req: any, res: any) {
  logApiRequest(req, res);
  const cors = handleCors(req, res, ['POST', 'OPTIONS']);
  if (!cors.ok) return sendError(res, 403, 'Origin not allowed');
  if (cors.preflight) return res.status(204).end();
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');

  const contentLength = Number.parseInt(String(req.headers['content-length'] || '0'), 10);
  if (contentLength > 50_000) return sendError(res, 413, 'Request too large');

  const ip = getClientIp(req);
  let rateLimit: Awaited<ReturnType<typeof checkRateLimit>>;
  try {
    rateLimit = await checkRateLimit(`checkout:${ip}`, 10, 60_000);
  } catch (error) {
    console.error('[CHECKOUT] Rate limiter unavailable:', error);
    return sendError(res, 503, 'Service temporairement indisponible');
  }
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return sendError(res, 429, 'Trop de tentatives. Veuillez réessayer plus tard.');
  }

  const parsed = checkoutSchema.safeParse(req.body || {});
  if (!parsed.success) return sendError(res, 400, 'Informations de commande invalides');

  const { items, customerInfo, recaptchaToken, requestId } = parsed.data;
  const customer = {
    name: sanitizePlainText(customerInfo.name, 100),
    email: sanitizePlainText(customerInfo.email, 254).toLowerCase(),
    phone: sanitizePlainText(customerInfo.phone, 24),
    company: sanitizePlainText(customerInfo.company, 150),
    address: sanitizePlainText(customerInfo.address, 200),
    message: sanitizePlainText(customerInfo.message, 500),
  };
  if (!isValidEmail(customer.email) || !isValidPhone(customer.phone)) {
    return sendError(res, 400, 'Adresse email ou numéro de téléphone invalide');
  }

  if (!process.env.RECAPTCHA_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.error('[CHECKOUT] RECAPTCHA_SECRET_KEY is required in production');
    return sendError(res, 503, 'Le paiement est temporairement indisponible.');
  }

  if (process.env.RECAPTCHA_SECRET_KEY
    && !await verifyRecaptcha(recaptchaToken, 0.4, 'order_submit')) {
    return sendError(res, 403, 'La vérification anti-spam a échoué. Veuillez réessayer.');
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return sendError(res, 503, 'Le paiement en ligne est temporairement indisponible.');
  }

  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }

  const verifiedItems = [...quantities.entries()].map(([productId, quantity]) => {
    const product = getProductById(productId);
    return product && quantity <= product.stock ? { product, quantity } : null;
  });
  if (verifiedItems.some((item) => item === null)) {
    return sendError(res, 400, 'Un produit est indisponible ou la quantité demandée est invalide.');
  }

  const orderItems = verifiedItems.filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotal = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totals = calculateOrderTotals(subtotal);

  let appOrigin: string;
  try {
    const appBaseUrl = process.env.PUBLIC_APP_URL
      || (process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : '');
    if (!appBaseUrl) return sendError(res, 500, 'URL publique du site non configurée');
    appOrigin = new URL(appBaseUrl).origin;
  } catch {
    return sendError(res, 500, 'URL publique du site invalide');
  }
  if (!getAllowedOrigins().includes(appOrigin)) {
    return sendError(res, 500, 'URL publique du site non autorisée');
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const lineItems: CheckoutLineItem[] = orderItems.map(({ product, quantity }) => ({
      price_data: {
        currency: 'mad' as const,
        product_data: {
          name: product.name,
          description: product.description,
          metadata: { catalog_product_id: product.id },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity,
    }));

    if (totals.shippingFee > 0) {
      lineItems.push({
        price_data: { currency: 'mad' as const, product_data: { name: 'Frais de livraison' }, unit_amount: totals.shippingFee * 100 },
        quantity: 1,
      });
    }
    if (totals.tax > 0) {
      lineItems.push({
        price_data: { currency: 'mad' as const, product_data: { name: 'TVA (20 %)' }, unit_amount: totals.tax * 100 },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appOrigin}/products?payment=success`,
      cancel_url: `${appOrigin}/products?payment=cancelled`,
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_company: customer.company,
        customer_address: customer.address,
        customer_message: customer.message,
      },
    }, requestId ? { idempotencyKey: requestId } : undefined);

    if (!session.url) return sendError(res, 502, 'Impossible de créer la page de paiement.');
    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('[CHECKOUT] Stripe error:', error?.message || error);
    return sendError(res, 500, 'Erreur lors de la création de la session de paiement.');
  }
}
