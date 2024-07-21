import { Request, Response } from "express";
import {
  createInvitationService,
  deactivateInvitationService,
} from "../services/invitation.service";
import { UserRequest } from "../types";

const createInvitation = async (req: UserRequest, res: Response) => {
  const { org_id } = req.params;
  const { user_id } = req.user;
  // const user_id = "596406f3-b596-4176-ac32-a0328dfdb8b5"

  try {
    const invitation_link = await createInvitationService(org_id, user_id);
    res.status(201).json({ message: "Invitation created", invitation_link });
  } catch (error) {
    if (error.message === "Organization not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

const deactivateInvitation = async (req: UserRequest, res: Response) => {
  const { invitation_link } = req.body;
  const { user_id } = req.user;
  // const user_id = "596406f3-b596-4176-ac32-a0328dfdb8b5"

  try {
    const success = await deactivateInvitationService(invitation_link, user_id);
    if (success) {
      res.status(200).json({ message: "Invitation deactivated" });
    }
  } catch (error) {
    if (error.message === "Invalid invitation link format") {
      res.status(400).json({ message: error.message });
    } else if (error.message === "Invitation not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Invitation link has expired") {
      res.status(400).json({ message: error.message });
    } else if (error.message === "Organization not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "User is not authorized to deactivate this invitation link") {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export { createInvitation, deactivateInvitation };
