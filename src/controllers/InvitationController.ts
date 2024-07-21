import { Request, Response, NextFunction } from "express";
import {
  createInvitationService,
  deactivateInvitationService,
} from "../services/invitation.service";

interface InvitationRequest extends Request {
  user?: {
    user_id: string;
  };
}

const createInvitation = async (
  req: InvitationRequest,
  res: Response,
  next: NextFunction
) => {
  const { orgId } = req.params;
  const { user_id } = req.user;

  try {
    const invitation_link = await createInvitationService(orgId, user_id);
    res.status(201).json({ message: "Invitation created", invitation_link });
  } catch (error) {
    next(error);
  }
};

const deactivateInvitation = async (
  req: InvitationRequest,
  res: Response,
  next: NextFunction
) => {
  const { invitation_link } = req.body;
  const { user_id } = req.user;
  try {
    const success = await deactivateInvitationService(invitation_link, user_id);
    if (success) {
      res.status(200).json({ message: "Invitation deactivated" });
    }
  } catch (error) {
    next(error);
  }
};

export { createInvitation, deactivateInvitation };
