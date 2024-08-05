import { Router } from "express";
import { Limiter } from "../utils";
import { authMiddleware, checkOrgPermission } from "../middleware";
import asyncHandler from "../middleware/asyncHandler";
import admincontroller from "../controllers/admincontroller";
import { UserType } from "../types";
import { OrgRole } from "../models/user-organization";
import { validateData } from "../middleware/validationMiddleware";
import { orgUpdateSchema } from "../schemas/organization";

const adminRoute = Router();

const admin = new admincontroller.AdminOrganisationController();

adminRoute.patch(
  "/orgs/:id",
  validateData({ body: orgUpdateSchema }),
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  asyncHandler(admin.updateOrg),
);

adminRoute.delete(
  "/orgs/:org_id/delete",
  validateData({ body: orgUpdateSchema }),
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  asyncHandler(admin.deleteOrganization),
);

export { adminRoute };
