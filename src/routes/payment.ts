import { Router } from "express";
import { PaymentController } from "../controllers";
import { authMiddleware } from "../middleware";

const paymentFlutterwaveRouter = Router();

paymentFlutterwaveRouter.post(
  "/flutterwave/initiate",
  authMiddleware,
  PaymentController.initiatePayment,
);
paymentFlutterwaveRouter.get(
  "/flutterwave/verify/:transactionId",
  authMiddleware,
  PaymentController.verifyPayment,
);

export { paymentFlutterwaveRouter };
