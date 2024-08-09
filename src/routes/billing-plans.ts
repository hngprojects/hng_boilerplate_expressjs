import { Router } from "express";
import { BillingController } from "../controllers";
import { authMiddleware } from "../middleware";

const billingRouter = Router();

const billingController = new BillingController();

billingRouter.get(
  "/billing-plans",
  authMiddleware,
  billingController.getAllBillings,
);

export { billingRouter };
