import express from 'express';
import contactHandler from '../../api/contact';
import checkoutHandler from '../../api/checkout';
import quoteHandler from '../../api/quote';
import healthHandler from '../../api/health';

const router = express.Router();

// Reuse the same handlers for local Express development and Vercel deployment.
router.all('/contact', (req, res) => contactHandler(req, res));
router.all('/checkout', (req, res) => checkoutHandler(req, res));
router.all('/quote', (req, res) => quoteHandler(req, res));
router.all('/health', (req, res) => healthHandler(req, res));

export default router;
