import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import { User } from "../models/user";

import { IOrgService, IUserService } from "../types";

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

    // Check if the user is part of the organization
    const userInOrganization = organization.users.some(
      (user) => user.id === user_id,
    );
    if (!userInOrganization) {
      return null;
    }

    // Remove the user from the organization
    organization.users = organization.users.filter(
      (user) => user.id !== user_id,
    );
    await organizationRepository.save(organization);

    return user;
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
