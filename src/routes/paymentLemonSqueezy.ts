import { Router } from "express";
import {
  makePaymentLemonSqueezy,
  LemonSqueezyWebhook,
} from "../controllers/PaymentLemonSqueezyController";
import { authMiddleware } from "../middleware/auth";
import BodyParser from "body-parser";
const paymentRouter = Router();

paymentRouter.get(
  "/payments/lemonsqueezy/initiate",
  authMiddleware,
  makePaymentLemonSqueezy,
);
paymentRouter.post(
  "/payments/lemonsqueezy/webhook",
  BodyParser.text({ type: "*/*" }),
  LemonSqueezyWebhook,
);

export { paymentRouter };
