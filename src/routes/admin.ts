import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { AdminOrganisationController } from "../controllers";
import { UserType } from "../types";
import { validateData } from "../middleware/validationMiddleware";
import { orgUpdateSchema } from "../schemas/organization";

const adminRoute = Router();

const admin = new AdminOrganisationController();

adminRoute.patch(
  "/orgs/:id",
  validateData({ body: orgUpdateSchema }),
  authMiddleware,
  checkPermissions([UserType.SUPER_ADMIN]),
  admin.updateOrg,
);

adminRoute.delete(
  "/orgs/:org_id/delete",
  validateData({ body: orgUpdateSchema }),
  authMiddleware,
  checkPermissions([UserType.SUPER_ADMIN]),
  admin.deleteOrganization,
);

export { adminRoute };
