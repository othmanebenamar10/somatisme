import express from 'express';
import contactHandler from '../../api/contact';
import orderEmailHandler from '../../api/send-order-email';
import checkoutHandler from '../../api/checkout';
import healthHandler from '../../api/health';

const router = express.Router();

// Reuse the same handlers for local Express development and Vercel deployment.
router.all('/contact', (req, res) => contactHandler(req, res));
router.all('/send-order-email', (req, res) => orderEmailHandler(req, res));
router.all('/checkout', (req, res) => checkoutHandler(req, res));
router.all('/health', (req, res) => healthHandler(req, res));

export default router;
