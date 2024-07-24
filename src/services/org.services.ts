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
    user_id: string,
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

    const userInOrganization = organization.users.some(
      (user) => user.id === user_id,
    );
    if (!userInOrganization) {
      return null;
    }

    organization.users = organization.users.filter(
      (user) => user.id !== user_id,
    );
    await organizationRepository.save(organization);

    return user;
  }

  public async getOrganizationsByUserId(
    user_id: string,
  ): Promise<Organization[]> {
    log.info(`Fetching organizations for user_id: ${user_id}`);
    try {
      const organizationRepository = AppDataSource.getRepository(Organization);

      const organizations = await organizationRepository.find({
        where: { owner_id: user_id },
      });

      log.info(`Organizations found: ${organizations.length}`);
      return organizations;
    } catch (error) {
      log.error(`Error fetching organizations for user_id: ${user_id}`, error);
      throw new Error("Failed to fetch organizations");
    }
  }

  public async getSingleOrg(org_id: string): Promise<Organization | null> {
    const organization = await AppDataSource.getRepository(
      Organization,
    ).findOne({
      where: { id: org_id },
      relations: ["users"],
    });
    if (!organization) {
      return null;
    }
    return organization;
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

    // Generate the invitation link
    const invitationLink = `https://yourapp.com/invite?token=${token}`;

    // Send the invitation email
    const emailContent = {
      from: "no-reply@yourapp.com",
      to: email,
      subject: "You are invited to join our organization",
      text: `Hello, you have been invited to join the organization. Use the following token to accept the invitation: ${token}`,
      html: `<p>Hello,</p><p>You have been invited to join the organization. Use the following token to accept the invitation:</p><p><strong>${invitationLink}</strong></p>`,
    };

    try {
      await Sendmail(emailContent);
    } catch (error) {
      log.error("Error sending email:", error);
    }

    return invitation;
  }
}
