import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createOrganisation } from "../controllers/createorgController"

const organisationRoute = Router();

organisationRoute.post("/organisations", authMiddleware, createOrganisation);

export { organisationRoute }