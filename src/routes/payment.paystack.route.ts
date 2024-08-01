import express from "express";
import { paystackController } from "../controllers/payment.paystack.controller";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();
const paystack = new paystackController();

router.post(
  "/organizations/:organization_id/payments/billing_plan/paystack/checkout-session",
  authMiddleware,
  paystack.startPayment,
);

// complete paystack payment
router.patch(
  "/organizations/:organization_id/payments/billing_plan/paystack/complete-payment/:payment_id",
  authMiddleware,
  paystack.completePayment,
);

router.get(
  "/organizations/:organization_id/payments/billing_plan/:payment_id",
  authMiddleware,
  paystack.getPaymentTransaction,
);

router.get(
  "/organizations/organization_id/payments/paysatck/verify-payment/:payment_id",
  authMiddleware,
  paystack.verifyPayment,
);
// router.get("/organizations/:organization_id/payments/billing_plan", paymentOptions); this should provide all the payment options available to the user;

export { router as paystackRouter };
