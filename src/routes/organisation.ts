import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { validateOrgId } from "../middleware/organization.validation";
import { UserRole } from "../enums/userRoles";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);


orgRouter.get("/organisations/:org_id", authMiddleware, validateOrgId,
  orgController.getSingleOrg.bind(orgController),
);

orgRouter.get("/organisations", authMiddleware, checkPermissions([UserRole.SUPER_ADMIN]), orgController.getAllOrgs.bind(orgController))

export { orgRouter };
