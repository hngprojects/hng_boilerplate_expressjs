import { Router, Request, Response } from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { OrgService } from "../services/OrgService";


const orgRouter = Router();
const orgController = new OrgController();

orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);

orgRouter.delete(
  "/organizations/:org_id/delete",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  orgController.deleteOrganization.bind(orgController)
);

export { orgRouter };
