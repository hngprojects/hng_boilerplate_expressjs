import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware } from "../middleware";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController)
);

orgRouter.use(authMiddleware);
orgRouter.get("/invite/default/:org_id", orgController.acceptInvite);

export { orgRouter };
