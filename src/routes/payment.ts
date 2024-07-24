import { Router } from "express";
import { PaymentController } from "../controllers";
import { authMiddleware } from "../middleware";

const paymentRouter = Router();

paymentRouter.post(
  "/flutterwave/initiate",
  authMiddleware,
  PaymentController.initiatePayment,
);
// paymentRouter.get('/flutterwave/verify/:transactionId',authMiddleware, PaymentController.verifyPayment);

export { paymentRouter };
