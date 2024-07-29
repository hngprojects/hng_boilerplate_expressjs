import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { organizationValidation } from "../middleware/organization.validation";
import { validateOrgId } from "../middleware/organization.validation";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.get(
  "/organizations/:org_id",
  authMiddleware,
  validateOrgId,
  orgController.getSingleOrg.bind(orgController),
);
orgRouter.delete(
  "/organizations/:org_id/user/:user_id",
  authMiddleware,
  validateOrgId,
  orgController.removeUser.bind(orgController),
);

orgRouter.post(
  "/organizations",
  authMiddleware,
  organizationValidation,
  orgController.createOrganisation.bind(orgController),
);
orgRouter.post(
  "/organizations/join",
  authMiddleware,
  orgController.joinOrganization.bind(orgController),
);
orgRouter.post(
  "/organizations/:orgId/invite",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  orgController.createInvitation.bind(orgController),
);
orgRouter.get(
  "/users/:id/organizations",
  authMiddleware,
  orgController.getOrganizations.bind(orgController),
);
orgRouter.patch(
  "/organizations/:org_id",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.USER]),
  orgController.updateOrganisation.bind(orgController),
);

export { orgRouter };
