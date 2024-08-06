import { Router } from "express";
import {
  generateGenericInviteLink,
  generateAndSendInviteLinks,
} from "../controllers";
import { checkPermissions, authMiddleware } from "../middleware";
import { UserType } from "../enums/UserType";

const inviteRoute = Router();

inviteRoute.get(
  "/organizations/:org_id/invite",
  authMiddleware,
  checkPermissions([UserType.ADMIN, UserType.SUPER_ADMIN]),
  generateGenericInviteLink,
);
inviteRoute.post(
  "/organizations/:org_id/send-invite",
  authMiddleware,
  checkPermissions([UserType.SUPER_ADMIN, UserType.ADMIN]),
  generateAndSendInviteLinks,
);

export { inviteRoute };
