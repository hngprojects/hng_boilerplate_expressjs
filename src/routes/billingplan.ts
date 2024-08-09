import { Router } from "express";
import { BillingPlanController } from "../controllers";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const billingPlanRouter = Router();
const billingPlanController = new BillingPlanController();

billingPlanRouter.post(
  "/billing-plans",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  billingPlanController.createBillingPlan,
);

billingPlanRouter.get(
  "/billing-plans/:id",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  billingPlanController.getBillingPlans,
);

export { billingPlanRouter };
