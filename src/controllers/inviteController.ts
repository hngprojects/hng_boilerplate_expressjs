import { NextFunction, Request, Response } from "express";
import { InviteService } from "../services";
import asyncHandler from "../middleware/asyncHandler";
import { sendJsonResponse } from "../helpers";
import { InvalidInput } from "../middleware";
import { send } from "process";

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
