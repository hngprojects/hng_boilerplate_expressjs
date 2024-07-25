import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import { User } from "../models/user";
import { ICreateOrganisation, IOrgService } from "../types";
import log from "../utils/logger";
import { BadRequest } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { UserOrganization } from "../models";

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
      throw new BadRequest("Client error");
    }
  }

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
}
