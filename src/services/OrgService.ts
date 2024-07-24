import { Organization } from "../models/organization";
import AppDataSource from "../data-source";
import { User } from "../models/user";
import { IOrgService } from "../types";
import { InviteLink } from "../models/invite";

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

  public async createInviteLink(org_id: string, host: string) {
    //
    const organizationRepository = AppDataSource.getRepository(Organization);

    const organization = await organizationRepository.findOne({
      where: { id: org_id },
      relations: ["users"],
    });
    if (!organization) {
      return null;
    }

    const invitelink = new InviteLink();
    invitelink.link = `${host}/invite/accept/${organization.id}`;
    const newInviteLink = await AppDataSource.manager.save(invitelink);

    return newInviteLink;
  }

  public async acceptLinkInvite(
    org_id: string,
    current_user: User
  ): Promise<Organization | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: org_id },
      relations: ["users"],
    });
    if (!organization) {
      return null;
    }

    // Check if the user is already part of the organization
    const userInOrganization = organization.users.some(
      (user) => user.id === current_user.id
    );
    if (userInOrganization) {
      return null;
    }

    organization.users.push(current_user);
    await organizationRepository.save(organization);

    return organization;
  }
}
