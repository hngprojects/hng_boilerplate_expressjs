import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { createBillingPlan } from "../controllers/billingPlanController";
import { UserRole } from "../enums/userRoles";

const billingPlanRouter = Router();

billingPlanRouter.post("/billing-plans", authMiddleware, createBillingPlan);

export { billingPlanRouter };
