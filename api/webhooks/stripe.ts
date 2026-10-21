import Stripe from 'stripe';
import { isValidEmail, logApiRequest, sendError } from '../_lib/security.js';
import { calculateOrderTotals } from '../_lib/pricing.js';
import { getProductById } from '../../shared/products.js';
import { sendPaidOrderEmails } from '../send-order-email.js';

export const config = { api: { bodyParser: false } };

async function readRawBody(req: any): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) {
    if (req.body.length > 1_000_000) throw new Error('Webhook payload too large');
    return req.body;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) throw new Error('Webhook payload too large');
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  logApiRequest(req, res);
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[STRIPE WEBHOOK] Stripe secrets are not configured');
    return sendError(res, 503, 'Webhook indisponible');
  }

  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') return sendError(res, 400, 'Missing Stripe signature');

  let event: Stripe.Event;
  try {
    const rawBody = await readRawBody(req);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    console.warn('[STRIPE WEBHOOK] Signature or payload rejected:', error?.message || error);
    return sendError(res, 400, 'Invalid Stripe webhook signature');
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== 'payment' || session.payment_status !== 'paid' || session.currency !== 'mad') {
      return res.status(200).json({ received: true, ignored: true });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ['data.price.product'],
    });
    const quantities = new Map<string, number>();
    for (const lineItem of lineItems.data) {
      const product = lineItem.price?.product;
      if (!product || typeof product === 'string' || !('metadata' in product)) continue;
      const catalogId = product.metadata.catalog_product_id;
      if (!catalogId || !Number.isInteger(lineItem.quantity) || !lineItem.quantity || lineItem.quantity < 1) {
        return sendError(res, 400, 'Invalid product data in Stripe session');
      }
      quantities.set(catalogId, (quantities.get(catalogId) || 0) + lineItem.quantity);
    }
    if (quantities.size === 0) return sendError(res, 400, 'No catalog products found in Stripe session');

    const items = [...quantities.entries()].map(([productId, quantity]) => {
      const product = getProductById(productId);
      return product && quantity <= product.stock ? { productId, quantity, product } : null;
    });
    if (items.some((item) => item === null)) {
      return sendError(res, 400, 'Paid order contains unavailable catalog items');
    }
    const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null);
    const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totals = calculateOrderTotals(subtotal);
    if (session.amount_total !== totals.total * 100) {
      console.error('[STRIPE WEBHOOK] Paid amount does not match catalog total', { sessionId: session.id });
      return sendError(res, 400, 'Paid amount does not match order total');
    }

    const customerEmail = session.customer_details?.email || session.customer_email || '';
    if (!isValidEmail(customerEmail)) return sendError(res, 400, 'Missing customer email');
    const metadata = session.metadata || {};
    const result = await sendPaidOrderEmails({
      sessionId: session.id,
      customerEmail,
      customerName: metadata.customer_name || session.customer_details?.name || 'Client',
      customerPhone: metadata.customer_phone || session.customer_details?.phone || '',
      company: metadata.customer_company || '',
      address: metadata.customer_address || '',
      message: metadata.customer_message || '',
      items: validItems.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    if (result === 'busy') return sendError(res, 503, 'Order confirmation is already processing');
    return res.status(200).json({ received: true, emailStatus: result });
  } catch (error: any) {
    console.error('[STRIPE WEBHOOK] Failed to process paid checkout:', error?.message || error);
    return sendError(res, 500, 'Webhook processing failed');
  }
}
