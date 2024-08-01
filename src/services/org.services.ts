import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import { User } from "../models/user";
import { ICreateOrganisation, IOrgService } from "../types";
import log from "../utils/logger";
import { BadRequest } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { UserOrganization, Invitation, OrgInviteToken } from "../models";
import { v4 as uuidv4 } from "uuid";
import { addEmailToQueue } from "../utils/queue";
import renderTemplate from "../views/email/renderTemplate";
import { Conflict, ResourceNotFound } from "../middleware/error";

export class OrgService implements IOrgService {
  private invitationRepository = AppDataSource.getRepository(Invitation);
  private organisationRepository = AppDataSource.getRepository(Organization);
  private userRepository = AppDataSource.getRepository(User);
  private userOrganizationRepository =
    AppDataSource.getRepository(UserOrganization);
  private orgInviteTokenRepository =
    AppDataSource.getRepository(OrgInviteToken);

  public async createOrganisation(
    payload: ICreateOrganisation,
    userId: string,
  ): Promise<{
    newOrganisation: Partial<Organization>;
  }> {
    try {
      const organisation = new Organization();
      organisation.owner_id = userId;
      Object.assign(organisation, payload);

      const newOrganisation = await AppDataSource.manager.save(organisation);

      const userOrganization = new UserOrganization();
      userOrganization.userId = userId;
      userOrganization.organizationId = newOrganisation.id;
      userOrganization.role = UserRole.ADMIN;

      await AppDataSource.manager.save(userOrganization);

      return { newOrganisation };
    } catch (error) {
      console.log(error);
      throw new BadRequest("Client error");
    }
  }

  public async removeUser(
    org_id: string,
    user_id: string,
  ): Promise<User | null> {
    const userOrganizationRepository =
      AppDataSource.getRepository(UserOrganization);
    const organizationRepository = AppDataSource.getRepository(Organization);
    const userRepository = AppDataSource.getRepository(User);

    try {
      // Find the UserOrganization entry
      const userOrganization = await userOrganizationRepository.findOne({
        where: { userId: user_id, organizationId: org_id },
        relations: ["user", "organization"],
      });

      if (!userOrganization) {
        return null;
      }

      // Remove the UserOrganization entry
      await userOrganizationRepository.remove(userOrganization);

      // Update the organization's users list
      const organization = await organizationRepository.findOne({
        where: { id: org_id, owner_id: user_id },
        relations: ["users"],
      });

      if (organization) {
        organization.users = organization.users.filter(
          (user) => user.id !== user_id,
        );
        await organizationRepository.save(organization);
      }

      // Return the removed user
      return userOrganization.user;
    } catch (error) {
      throw new Error("Failed to remove user from organization");
    }
  }

  public async getOrganizationsByUserId(
    user_id: string,
  ): Promise<Organization[]> {
    log.info(`Fetching organizations for user_id: ${user_id}`);
    try {
      const userOrganizationRepository =
        AppDataSource.getRepository(UserOrganization);

      const userOrganizations = await userOrganizationRepository.find({
        where: { userId: user_id },
        relations: ["organization"],
      });

      const organization = userOrganizations.map((org) => org.organization);

      log.info(`Organizations found: ${userOrganizations.length}`);
      return organization;
    } catch (error) {
      log.error(`Error fetching organizations for user_id: ${user_id}`, error);
      throw new Error("Failed to fetch organizations");
    }
  }

  public async getSingleOrg(
    org_id: string,
    user_id: string,
  ): Promise<Organization | null> {
    try {
      const userOrganizationRepository =
        AppDataSource.getRepository(UserOrganization);

      const userOrganization = await userOrganizationRepository.findOne({
        where: { userId: user_id, organizationId: org_id },
        relations: ["organization"],
      });

      console.log(userOrganization);

      return userOrganization?.organization || null;
    } catch (error) {
      throw new Error("Failed to fetch organization");
    }
  }
  public UpdateOrganizationDetails = async (
    organizationId: string,
    updateData: Partial<Organization>,
  ) => {
    const organizationRepository = AppDataSource.getRepository(Organization);

    const organization = await organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error(`Organization with ID ${organizationId} not found`);
    }

    organizationRepository.merge(organization, updateData);
    await organizationRepository.save(organization);

    return organization;
  };

  public async generateInviteLink(orgId: string): Promise<string> {
    const userOrganization = await this.organisationRepository.findOne({
      where: { id: orgId },
    });
    if (!userOrganization) {
      throw new ResourceNotFound("Organization not found.");
    }

    const tokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const orgInvteToken = new OrgInviteToken();
    orgInvteToken.token = tokenValue;
    orgInvteToken.expires_at = expiresAt;
    orgInvteToken.organization = userOrganization;

    await this.orgInviteTokenRepository.save(orgInvteToken);

    return tokenValue;
  }

  public async sendInviteLinks(orgId: string, emails: string[]): Promise<void> {
    const organization = await this.organisationRepository.findOne({
      where: { id: orgId },
    });

    if (!organization) {
      throw new ResourceNotFound("Organization not found.");
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    for (const email of emails) {
      const tokenValue = uuidv4();

      const orgInviteToken = new OrgInviteToken();
      orgInviteToken.token = tokenValue;
      orgInviteToken.expires_at = expiresAt;
      orgInviteToken.organization = organization;

      await this.orgInviteTokenRepository.save(orgInviteToken);

      const invitation = new Invitation();
      invitation.token = tokenValue;
      invitation.organization = organization;
      invitation.email = email;
      invitation.orgInviteToken = orgInviteToken;

      await this.invitationRepository.save(invitation);

      const inviteLink = `https://example.com?accept-invite?${tokenValue}`;

      const emailContent = {
        userName: "",
        title: "Invitation to Join Organization",
        body: `<p>You have been invited to join ${organization.name} organization. Please use the following link to accept the invitation:</p><a href="${inviteLink}">Here</a>`,
      };
      const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Invitation to Join Organization",
        html: renderTemplate("custom-email", emailContent),
      };

      // addEmailToQueue(mailOptions);
    }
  }

  public async joinOrganizationByInvite(
    token: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new ResourceNotFound("Please register to join the organization");
    }

    let organization;
    const invitation = await this.invitationRepository.findOne({
      where: { token: token, email: user.email },
      relations: ["organization"],
    });

    if (invitation) {
      organization = invitation.organization;
    } else {
      const orgInviteToken = await this.orgInviteTokenRepository.findOne({
        where: { token: token },
        relations: ["organization"],
      });

      if (!orgInviteToken) {
        throw new ResourceNotFound("Invalid invitation token.");
      }

      organization = orgInviteToken.organization;
    }

    if (!organization) {
      throw new ResourceNotFound("Organization not found.");
    }

    const existingUserOrg = await this.userOrganizationRepository.findOne({
      where: { user: { id: userId }, organization: { id: organization.id } },
    });

    if (existingUserOrg) {
      throw new Conflict("You are already a member.");
    }

    const userOrganization = new UserOrganization();
    userOrganization.user = user;
    userOrganization.organization = organization;
    userOrganization.role = UserRole.USER;

    await this.userOrganizationRepository.save(userOrganization);

    // if (invitation) {
    //   await this.invitationRepository.remove(invitation);
    // }
  }
}
