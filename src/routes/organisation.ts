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
  "/organisations/:org_id/user/:user_id",
  authMiddleware,
  validateOrgId,
  orgController.removeUser.bind(orgController),
);

orgRouter.post(
  "/organisations",
  authMiddleware,
  organizationValidation,
  orgController.createOrganisation.bind(orgController),
);
orgRouter.post(
  "/organisations/join",
  authMiddleware,
  orgController.joinOrganization.bind(orgController),
);
orgRouter.post(
  "/organisations/:orgId/invite",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  orgController.createInvitation.bind(orgController),
);
orgRouter.get(
  "/users/:id/organisations",
  authMiddleware,
  orgController.getOrganizations.bind(orgController),
);

orgRouter.get(
  "/members/search",
  authMiddleware,
  orgController.searchOrganizationMembers.bind(orgController),
);
export { orgRouter };
