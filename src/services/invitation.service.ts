import { getRepository } from "typeorm";
import { OrganisationInvitation, Organization } from "../models";
import { User } from "../models";
import { UserRole } from "../enums/userRoles";
import { AppDataSource } from "../data-source";

const invitationLinkPattern = /^invite-[a-zA-Z0-9\-]{36}-\d+$/;

const createInvitationService = async (org_id: string, user_id: string) => {
  const organization = await AppDataSource.getRepository(Organization).findOne({
    where: {
      id: org_id,
    },
  });
  if (!organization) {
    throw new Error("Organization not found");
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: {
      id: user_id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  
  const invitation_link = `invite-${organization.id}-${Date.now()}`;
  const invitation = AppDataSource.getRepository(OrganisationInvitation).create({
    invitation_link,
    org_id,
    user_id,
    organization,
    user,
  });
  await AppDataSource.getRepository(OrganisationInvitation).save(invitation);
  return invitation_link;
};

const deactivateInvitationService = async (invitation_link: string, user_id: string) => {
  if (!invitationLinkPattern.test(invitation_link)) {
    throw new Error("Invalid invitation link format");
  }

  const invitation = await AppDataSource.getRepository(OrganisationInvitation).findOne({
    where: { invitation_link },
  });
  if (!invitation) {
    throw new Error("Invitation not found");
  }

  const current_date = new Date();
  if (invitation.expire_at && invitation.expire_at < current_date) {
    throw new Error("Invitation link has expired");
  }

  const organization = await AppDataSource.getRepository(Organization).findOne({
    where: {
      id: invitation.org_id
    }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: {
      id: user_id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }

  const authorized_roles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
  if (invitation.user_id !== user_id && !authorized_roles.find(role => role === user.role)) {
    throw new Error("User is not authorized to deactivate this invitation link");
  }  

  invitation.is_active = false;
  invitation.deactivated_at = new Date();
  await AppDataSource.getRepository(OrganisationInvitation).save(invitation);
  return true;
};

export { createInvitationService, deactivateInvitationService };
