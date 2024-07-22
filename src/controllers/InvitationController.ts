import { Request, Response, NextFunction } from "express";
import {
  createInvitationService,
  deactivateInvitationService,
} from "../services/invitation.service";
import { User } from "../models";

interface UserRequest extends Request {
  user: User;
}

const createInvitation = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { orgId } = req.params;
  const { id: userId } = req.user;

  try {
    const invitation_link = await createInvitationService(orgId, userId);
    res.status(201).json({ message: "Invitation created", invitation_link });
  } catch (error) {
    next(error);
  }
};

const deactivateInvitation = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { invitation_link } = req.body;
  const { id: userId } = req.user;
  try {
    const success = await deactivateInvitationService(invitation_link, userId);
    if (success) {
      res.status(200).json({ message: "Invitation deactivated" });
    }
  } catch (error) {
    next(error);
  }
};

export { createInvitation, deactivateInvitation };
