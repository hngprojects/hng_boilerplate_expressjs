import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
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
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  validateOrgId,
  orgController.removeUser.bind(orgController),
);
orgRouter.post(
  "/organizations/:org_id/invite",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  orgController.createInvitation.bind(orgController),
);
orgRouter.get(
  "/organisations/:org_id",
  authMiddleware,
  validateOrgId,
  orgController.getSingleOrg.bind(orgController),
);

orgRouter.get(
  "/users/:id/organizations",
  authMiddleware,
  orgController.getOrganizations.bind(orgController),
);
export { orgRouter };
