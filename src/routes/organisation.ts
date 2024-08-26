import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { UserRole } from "../enums/userRoles";
import {
  authMiddleware,
  checkPermissions,
  organizationValidation,
  validateOrgId,
  validateOrgRole,
  validateUpdateOrg,
} from "../middleware";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.get(
  "/organisations/invites",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  orgController.getAllInvite.bind(orgController),
);
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

orgRouter.get(
  "/organisations/:org_id/invite",
  authMiddleware,
  checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  orgController.generateGenericInviteLink.bind(orgController),
);

orgRouter.post(
  "organisations/:org_id/roles",
  authMiddleware,
  validateOrgRole,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  orgController.createOrganizationRole.bind(orgController),
);

orgRouter.post(
  "/organisations/:org_id/send-invite",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  orgController.generateAndSendInviteLinks.bind(orgController),
);
orgRouter.post(
  "/organisations/accept-invite",
  authMiddleware,
  orgController.addUserToOrganizationWithInvite.bind(orgController),
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

orgRouter.put(
  "/organisations/:organization_id",
  authMiddleware,
  validateUpdateOrg,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.USER]),
  orgController.updateOrganisation.bind(orgController),
);

orgRouter.get(
  "/organisations/:org_id/roles/:role_id",
  authMiddleware,
  orgController.getSingleRole.bind(orgController),
);

orgRouter.get(
  "/organisations/:org_id/roles",
  authMiddleware,
  orgController.getAllOrganizationRoles.bind(orgController),
);

orgRouter.put(
  "/organisations/:org_id/roles/:role_id/permissions",
  authMiddleware,
  checkPermissions([UserRole.ADMIN]),
  orgController.updateOrganizationRolePermissions.bind(orgController),
);

orgRouter.get(
  "/organisations/:org_id/products",
  authMiddleware,
  orgController.getAllOrgProducts,
);

export { orgRouter };
