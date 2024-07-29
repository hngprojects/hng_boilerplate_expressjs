import { Router } from "express";
import exportController from "../controllers/exportController";
import { authMiddleware } from "../middleware";
import { checkPermissions } from "../middleware/checkUserRole";
import { UserRole } from "../enums/userRoles";

const exportRouter = Router();

exportRouter.get(
  "/organisation/members/export",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.USER]),
  exportController.exportData,
);

export { exportRouter };
