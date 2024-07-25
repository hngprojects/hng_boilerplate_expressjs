/**
 * main routes for paymentStripe
 */
import { Router } from "express";
import { createPaymentIntentStripe } from "../controllers/paymentStripeController";
import { validatePaymentRequest } from "../middleware/paymentStripeValidation";
import { authMiddleware } from "../middleware/auth";

const paymentStripeRouter = Router();

paymentStripeRouter.post(
  "/initiate",
  validatePaymentRequest,
  validatePaymentRequest,
  createPaymentIntentStripe,
);

export { paymentStripeRouter };
