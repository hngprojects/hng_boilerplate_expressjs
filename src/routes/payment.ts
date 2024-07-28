import { Router } from "express";
import { PaymentController } from "../controllers";
import { authMiddleware } from "../middleware";

const paymentFlutterwaveRouter = Router();

paymentFlutterwaveRouter.post(
  "/payments/flutterwave/initiate",
  authMiddleware,
  PaymentController.initiatePayment,
);
paymentFlutterwaveRouter.get(
  "/payments/flutterwave/verify/:transactionId",
  authMiddleware,
  PaymentController.verifyPayment,
);

export { paymentFlutterwaveRouter };
