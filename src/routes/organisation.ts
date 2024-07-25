import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { organizationValidation } from "../middleware/organization.validation";
import { validateOrgId } from "../middleware/organization.validation";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.get(
  "/organisations/:org_id",
  authMiddleware,
  validateOrgId,
  orgController.getSingleOrg.bind(orgController),
);
orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);

orgRouter.post(
  "/",
  authMiddleware,
  organizationValidation,
  orgController.createOrganisation.bind(orgController),
);

orgRouter.get(
  "/users/:id/organisations",
  authMiddleware,
  orgController.getOrganizations.bind(orgController),
);

export { orgRouter };
