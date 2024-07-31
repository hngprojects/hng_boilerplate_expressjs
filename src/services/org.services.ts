import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import { User } from "../models/user";
import { ICreateOrganisation, IOrgService } from "../types";
import log from "../utils/logger";
import { BadRequest } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { UserOrganization, Invitation } from "../models";
import { v4 as uuidv4 } from "uuid";
import { addEmailToQueue } from "../utils/queue";
import renderTemplate from "../views/email/renderTemplate";

export class OrgService implements IOrgService {
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

  public async createInvitation(
    orgId: string,
    email: string,
    inviterId: string,
  ): Promise<void> {
    const invitationRepository = AppDataSource.getRepository(Invitation);
    const organisationRepository = AppDataSource.getRepository(Organization);
    const userRepository = AppDataSource.getRepository(User);

    const organization = await organisationRepository.findOne({
      where: { id: orgId },
    });
    if (!organization) {
      throw new Error("Organization not found.");
    }

    const inviter = await userRepository.findOne({ where: { id: inviterId } });
    if (!inviter) {
      throw new Error("Inviter not found.");
    }

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(inviter.role)) {
      throw new Error("Permission denied.");
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7days

    const invitation = new Invitation();
    invitation.token = token;
    invitation.expires_at = expiresAt;
    invitation.organization = organization;
    invitation.user = inviter;
    invitation.email = email;

    await invitationRepository.save(invitation);

    // add the base url in the .env file
    const inviteLink = `https://appdomain.com/accept-invite?token=${token}`;
    // add a customised email
    const emailcontent = {
      userName: "",
      title: "Invitation to Join Organization",
      body: `<p>You have been invited to join  ${invitation.organization.name} organisation. Please use the following link to accept the invitation:</p><a href="${inviteLink}">Here</a>`,
    };
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Invitation to Join Organization",
      html: renderTemplate("custom-email", emailcontent),
    };

    addEmailToQueue(mailOptions);
  }

  public async joinOrganizationByInvite(
    inviteToken: string,
    userId: string,
  ): Promise<void> {
    const invitationRepository = AppDataSource.getRepository(Invitation);
    const userRepository = AppDataSource.getRepository(User);
    const organizationRepository = AppDataSource.getRepository(Organization);
    const userOrganizationRepository =
      AppDataSource.getRepository(UserOrganization);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(
        "User is not registered. Please register to join the organisation",
      );
    }

    const invitation = await invitationRepository.findOne({
      where: { token: inviteToken, email: user.email },
      relations: ["organization"],
    });
    if (!invitation || invitation.expires_at < new Date()) {
      throw new Error("Invalid or expired invitation.");
    }

    const organization = await organizationRepository.findOne({
      where: { id: invitation.organization.id },
      relations: ["userOrganizations"],
    });
    if (!organization) {
      throw new Error("Organisation not found.");
    }

    const existingUserOrg = organization.userOrganizations.find(
      (userOrg) => userOrg.userId === userId,
    );

    if (existingUserOrg) {
      throw new Error("User is already a member of the organisation.");
    }

    const userOrganization = new UserOrganization();
    userOrganization.user = user;
    userOrganization.organization = organization;
    userOrganization.role = UserRole.USER;

    await userOrganizationRepository.save(userOrganization);

    // delete invitation used
    await invitationRepository.remove(invitation);
  }
  // public async updateOrganizationDetails(
  //   org_id: string,
  //   update_data: Partial<Organization>
  // ): Promise<Organization> {
  //   const organizationRepository = AppDataSource.getRepository(Organization);

  //   const organization = await organizationRepository.findOne({
  //     where: { id: org_id },
  //   });

  //   if (!organization) {
  //     throw new Error("Organization not found");
  //   }

  //   console.log("Updating organization with data:", update_data);

  //   Object.assign(organization, update_data);

  //   try {
  //     await organizationRepository.save(organization);
  //   } catch (error) {
  //     console.error("Error saving organization:", error);
  //     throw error;
  //   }
  //   return organization;
  // }
  public async updateOrganizationDetails(
    org_id: string,
    update_data: Partial<Organization>,
  ): Promise<Organization> {
    const organizationRepository = AppDataSource.getRepository(Organization);

    const organization = await organizationRepository.findOne({
      where: { id: org_id },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    console.log("Updating organization with data:", update_data);

    Object.assign(organization, update_data);

    try {
      await organizationRepository.save(organization);
    } catch (error) {
      console.error("Error saving organization:", error);
      throw error;
    }
    return organization;
  }
}
