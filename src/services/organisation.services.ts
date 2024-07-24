import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import { User } from "../models/user";
import { Invitation } from "../models/invitation";
import { v4 as uuidv4 } from "uuid";
import { Sendmail } from "../utils/mail";
import { IOrgService, IUserService } from "../types";
import log from "../utils/logger";

export class OrgService implements IOrgService {
  public async removeUser(
    org_id: string,
    user_id: string
  ): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    const organizationRepository = AppDataSource.getRepository(Organization);

    const user = await userRepository.findOne({
      where: { id: user_id },
      relations: ["organizations"],
    });
    if (!user) {
      return null;
    }

    const organization = await organizationRepository.findOne({
      where: { id: org_id },
      relations: ["users"],
    });
    if (!organization) {
      return null;
    }

    // Check if the user is part of the organization
    const userInOrganization = organization.users.some(
      (user) => user.id === user_id
    );
    if (!userInOrganization) {
      return null;
    }

    // Remove the user from the organization
    organization.users = organization.users.filter(
      (user) => user.id !== user_id
    );
    await organizationRepository.save(organization);

    return user;
  }

  public async createInvitation(
    org_id: string,
    email: string,
    expiresIn: number
  ): Promise<Invitation | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const userRepository = AppDataSource.getRepository(User);
    const invitationRepository = AppDataSource.getRepository(Invitation);

    const organization = await organizationRepository.findOne({
      where: { id: org_id },
    });
    if (!organization) {
      return null;
    }

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    // generate unique invitation token
    const token = uuidv4();
    const expires_at = new Date(Date.now() + expiresIn);

    const invitation = new Invitation();
    invitation.token = token;
    invitation.expires_at = expires_at;
    invitation.user = user;
    invitation.organization = organization;

    await invitationRepository.save(invitation);

    // Send the invitation email
    const emailContent = {
      from: "no-reply@yourapp.com",
      to: email,
      subject: "You are invited to join our organization",
      text: `Hello, you have been invited to join the organization. Use the following token to accept the invitation: ${token}`,
      html: `<p>Hello,</p><p>You have been invited to join the organization. Use the following token to accept the invitation:</p><p><strong>${token}</strong></p>`,
    };

    try {
      await Sendmail(emailContent);
    } catch (error) {
      log.error("Error sending email:", error);
    }

    return invitation;
  }
}
