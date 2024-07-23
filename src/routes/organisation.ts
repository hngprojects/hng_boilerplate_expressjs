import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware } from "../middleware";
import { organizationValidation } from "../middleware/organization.validation";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.delete(
  "/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController)
);
orgRouter.post(
  "/",
  authMiddleware,
  organizationValidation,
  orgController.createOrganisation.bind(orgController)
);
export { orgRouter };
