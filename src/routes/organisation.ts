import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { UserRole } from "../enums/userRoles";
import {
  authMiddleware,
  checkPermissions,
  organizationValidation,
  validateOrgId,
  validateUpdateOrg,
} from "../middleware";

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
orgRouter.get(
  "/organizations/:org_id/invite",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),

  orgController.generateInviteLink.bind(orgController),
);
orgRouter.post(
  "/organizations",
  authMiddleware,
  organizationValidation,
  orgController.createOrganisation.bind(orgController),
);

orgRouter.post(
  "/organizations/accept-invite",
  authMiddleware,
  orgController.acceptInvite.bind(orgController),
);

orgRouter.post(
  "/organizations/:org_id/send-invite",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  orgController.sendInviteLinks.bind(orgController),
);
orgRouter.get(
  "/users/:id/organizations",
  authMiddleware,
  orgController.getOrganizations.bind(orgController),
);

orgRouter.get(
  "/members/search",
  authMiddleware,
  orgController.searchOrganizationMembers.bind(orgController),
);

orgRouter.put(
  "/organizations/:organization_id",
  authMiddleware,
  validateUpdateOrg,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.USER]),
  orgController.updateOrganisation.bind(orgController),
);
export { orgRouter };
