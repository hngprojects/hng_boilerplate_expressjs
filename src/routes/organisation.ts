import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);
orgRouter.post(
  "/organizations/:org_id/invite",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  orgController.createInvitation.bind(orgController),
);
export { orgRouter };
