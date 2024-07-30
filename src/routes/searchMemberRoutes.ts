import { Router } from "express";
import { searchOrganizationMembers } from "../controllers/SearchMembersController";
import { authMiddleware } from "../middleware/auth";

const searchOrganizationMembersRouter = Router();

searchOrganizationMembersRouter.post("/members/search", authMiddleware, searchOrganizationMembers);

export { searchOrganizationMembersRouter };
