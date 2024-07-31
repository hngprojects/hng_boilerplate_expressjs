import { Router } from "express";
import { searchOrganizationMembers } from "../controllers/SearchMembersController";
import { authMiddleware } from "../middleware/auth";

const searchOrganizationMembersRouter = Router();

searchOrganizationMembersRouter.get("/members/search", authMiddleware, searchOrganizationMembers);

export { searchOrganizationMembersRouter };
