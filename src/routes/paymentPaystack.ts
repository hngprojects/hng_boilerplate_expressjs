import { Router } from "express";
import {
  initializePaymentPaystack,
  verifyPaymentPaystack,
} from "../controllers";
import { authMiddleware } from "../middleware";

const paymentPaystackRouter = Router();

paymentPaystackRouter.post(
  "/payments/paystack/initiate",
  authMiddleware,
  initializePaymentPaystack,
);

paymentPaystackRouter.get(
  "/payments/paystack/verify/:reference",
  authMiddleware,
  verifyPaymentPaystack,
);

export { paymentPaystackRouter };
