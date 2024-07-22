import Router from "express";
import { deleteOrganisation, OrgController } from "../controllers/OrgController";
import { authMiddleware } from "../middleware";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);

orgRouter.delete("/organisations/:orgId", authMiddleware, deleteOrganisation);


export { orgRouter };
