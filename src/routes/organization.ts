import { Router } from "express";
import { ExportController } from "../controllers";
import { UserType } from "../types";
import { OrgRole } from "../models/user-organization";
import { authMiddleware, checkOrgPermission } from "../middleware";

const orgRouter = Router();

orgRouter.get(
  "/organisation/members/export",
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  ExportController.exportData,
);

export { orgRouter };
