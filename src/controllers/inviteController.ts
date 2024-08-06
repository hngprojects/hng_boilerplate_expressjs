import { NextFunction, Request, Response } from "express";
import { InviteService } from "../services";
import asyncHandler from "../middleware/asyncHandler";
import { sendJsonResponse } from "../helpers";
import { InvalidInput } from "../middleware";

const inviteService = new InviteService();
export const generateGenericInviteLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const link = await inviteService.generateGenericInviteLink(
      req.params.org_id,
    );
    if (link) {
      sendJsonResponse(res, 200, "Invite link generated successfully", link);
    }
  },
);
export const generateAndSendInviteLinks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const orgId = req.params.org_id;

    if (!email) {
      throw new InvalidInput("Email(s) are required!");
    }

    const emailList = Array.isArray(email) ? email : [email];
    await inviteService.generateAndSendInviteLinks(emailList, orgId);
    sendJsonResponse(res, 200, "Invitations successfully sent.", {});
  },
);
