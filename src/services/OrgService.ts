import { Organization } from "../models/organization";
import { AppDataSource } from "../data-source";
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


  // Get all the Organisations created by a user with his ID
  public async getOrganizationsByUserId(user_id: string): Promise<Organization[]> {
    const organizationRepository = AppDataSource.getRepository(Organization);

    const organizations = await organizationRepository.find({
      where: { id: user_id },  
    });

    return organizations;
  }
}
