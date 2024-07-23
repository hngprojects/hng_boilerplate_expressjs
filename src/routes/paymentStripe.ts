import express from 'express';
import { createPaymentIntentStripe } from '../controllers/paymentStripeController';
import { validatePaymentRequest } from '../middleware/paymentStripeValidation';
import { authMiddleware} from '../middleware/auth';

const router = express.Router();

// Route to initiate a payment using Stripe
router.post(
  '/api/v1/payments/initiate',
  authMiddleware, // Middleware for authentication
  validatePaymentRequest, // Validation middleware
  createPaymentIntentStripe // Controller to handle the payment initiation
);

export default router;
