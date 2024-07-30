import { Router } from "express";
import { searchOrganizationMembers } from "../controllers/SearchMembersController"

const searchOrganizationMembersRouter = Router();

searchOrganizationMembersRouter.post("/members/search", searchOrganizationMembers);

export { searchOrganizationMembersRouter };