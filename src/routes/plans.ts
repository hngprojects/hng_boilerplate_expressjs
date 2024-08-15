import { Router } from "express";
import {
  getCurrentPlan,
  comparePlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController";
import { authorizeRole } from "../middleware/authorisationSuperAdmin";
import { authMiddleware, validOrgAdmin } from "../middleware";
import { UserRole } from "../enums/userRoles";

const planRouter = Router();

planRouter.get(
  "admin/{userId}/current-plan",
  authMiddleware,
  authorizeRole([UserRole.SUPER_ADMIN]),
  getCurrentPlan,
);

planRouter.get(
  "admin/plans",
  authMiddleware,
  authorizeRole([UserRole.SUPER_ADMIN]),
  comparePlans,
);

planRouter.post(
  "admin/plans",
  authMiddleware,
  authorizeRole([UserRole.SUPER_ADMIN]),
  createPlan,
);

planRouter.delete(
  "/admin/{userId}/current-plan",
  authMiddleware,
  authorizeRole([UserRole.SUPER_ADMIN]),
  deletePlan,
);

planRouter.put(
  "/admin/{userId}/current-plan",
  authMiddleware,
  authorizeRole([UserRole.SUPER_ADMIN]),
  updatePlan,
);

export { planRouter };
