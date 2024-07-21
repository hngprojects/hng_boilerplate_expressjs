import { Router } from "express";
import { createOrganisation, deleteOrganisation } from "../controllers/OrgController";
import { authenticateJWT } from "../middleware/auth";

const organisationRoute = Router();

organisationRoute.post("/organisations", createOrganisation);
organisationRoute.delete("/organisations/:orgId", authenticateJWT, deleteOrganisation);


export { organisationRoute }
