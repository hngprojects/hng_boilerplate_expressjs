import { Router } from "express";
import { createOrganisation } from "../controllers/createorgController"

const organisationRoute = Router();

organisationRoute.post("/organisations", createOrganisation);

export { organisationRoute }