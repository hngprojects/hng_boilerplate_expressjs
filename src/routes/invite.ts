import { Router } from "express";
import { generateGenericInviteLink } from "../controllers";
import { checkPermissions, authMiddleware } from "../middleware";
import { UserType } from "../enums/UserType";

const inviteRoute = Router();

inviteRoute.get(
  "/organizations/:org_id/invite",
  authMiddleware,
  checkPermissions([UserType.ADMIN, UserType.SUPER_ADMIN]),
  generateGenericInviteLink,
);

export { inviteRoute };
