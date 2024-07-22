import Router from "express";
import { createOrganisation, deleteOrganisation } from "../controllers/OrgController";
import { authMiddleware } from "../middleware/auth";
import { OrgController } from "../controllers/OrgController";


const organisationRoute = Router();

const orgController = new OrgController();

organisationRoute.delete(
  "/organizations/:org_id/users/:user_id",
  orgController.removeUser.bind(orgController),
);
organisationRoute.post("/organisations", createOrganisation);
organisationRoute.delete("/organisations/:orgId", authMiddleware, deleteOrganisation);


export { organisationRoute }
