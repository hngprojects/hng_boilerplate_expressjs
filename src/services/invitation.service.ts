import { OrganisationInvitation, Organization } from "../models";
import { User } from "../models";
import { UserRole } from "../enums/userRoles";
import AppDataSource  from "../data-source";
import createHttpError from "http-errors";

const createInvitationService = async (orgId: string, userId: string) => {
  const organization = await AppDataSource.getRepository(Organization).findOne({
    where: { id: orgId },
  });
  if (!organization) {
    throw createHttpError(404, "Organization not found");
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
  });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const invitation_link = `invite-${orgId}-${Date.now()}`;
  const invitation = AppDataSource.getRepository(OrganisationInvitation).create(
    {
      invitation_link,
      org_id: orgId,
      user_id: userId,
      organization,
      user,
    }
  );
  await AppDataSource.getRepository(OrganisationInvitation).save(invitation);
  return invitation_link;
};

const deactivateInvitationService = async (
  invitation_link: string,
  userId: string
) => {
  const invitation = await AppDataSource.getRepository(
    OrganisationInvitation
  ).findOne({
    where: { invitation_link },
  });
  if (!invitation) {
    throw createHttpError(404, "Invitation not found");
  }

  const current_date = new Date();
  if (invitation.expire_at && invitation.expire_at < current_date) {
    throw createHttpError(400, "Invitation link has expired");
  }

  const organization = await AppDataSource.getRepository(Organization).findOne({
    where: { id: invitation.org_id },
  });
  if (!organization) {
    throw createHttpError(404, "Organization not found");
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
  });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const authorized_roles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
  if (!authorized_roles.includes(user.role)) {
    throw createHttpError(
      403,
      "User is not authorized to deactivate this invitation link"
    );
  }
  invitation.is_active = false;
  invitation.deactivated_at = new Date();
  await AppDataSource.getRepository(OrganisationInvitation).save(invitation);
  return true;
};

export { createInvitationService, deactivateInvitationService };
