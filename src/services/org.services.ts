import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import config from "../config/index";
import AppDataSource from "../data-source";
import { UserRole } from "../enums/userRoles";
import {
  BadRequest,
  ResourceNotFound,
  HttpError,
  Conflict,
} from "../middleware";
import { Organization, Invitation, UserOrganization } from "../models";
import { OrganizationRole } from "../models/organization-role.entity";
import { User } from "../models/user";
import { ICreateOrganisation, ICreateOrgRole, IOrgService } from "../types";
import log from "../utils/logger";

import { addEmailToQueue } from "../utils/queue";
import renderTemplate from "../views/email/renderTemplate";
import { PermissionCategory } from "../enums/permission-category.enum";
import { Permissions } from "../models/permissions.entity";
const frontendBaseUrl = config.BASE_URL;

export class OrgService implements IOrgService {
  private organizationRepository: Repository<Organization>;
  private organizationRoleRepository: Repository<OrganizationRole>;
  private permissionRepository: Repository<Permissions>;

  constructor() {
    this.organizationRepository = AppDataSource.getRepository(Organization);
    this.organizationRoleRepository =
      AppDataSource.getRepository(OrganizationRole);
  }
  public async createOrganisation(
    payload: ICreateOrganisation,
    userId: string,
  ): Promise<{
    new_organisation: Partial<Organization>;
  }> {
    try {
      const organisation = new Organization();
      organisation.owner_id = userId;
      Object.assign(organisation, payload);

      const new_organisation = await AppDataSource.manager.save(organisation);

      const userOrganization = new UserOrganization();
      userOrganization.userId = userId;
      userOrganization.organizationId = new_organisation.id;
      userOrganization.role = UserRole.ADMIN;

      await AppDataSource.manager.save(userOrganization);

      return { new_organisation };
    } catch (error) {
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
      const userOrganization = await userOrganizationRepository.findOne({
        where: { userId: user_id, organizationId: org_id },
        relations: ["user", "organization"],
      });

      if (!userOrganization) {
        return null;
      }

      await userOrganizationRepository.remove(userOrganization);

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
      if (!organization) {
        return null;
      }
      return userOrganization.user;
    } catch (error) {
      throw new Error("Failed to remove user from organization");
    }
  }

  public async getOrganizationsByUserId(
    user_id: string,
  ): Promise<Organization[]> {
    try {
      const userOrganizationRepository =
        AppDataSource.getRepository(UserOrganization);

      const userOrganizations = await userOrganizationRepository.find({
        where: { userId: user_id },
        relations: ["organization"],
      });

      const organization = userOrganizations.map((org) => org.organization);

      return organization;
    } catch (error) {
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

      return userOrganization?.organization || null;
    } catch (error) {
      throw new Error("Failed to fetch organization");
    }
  }
  public async updateOrganizationDetails(
    org_id: string,
    userId: string,
    update_data: Partial<Organization>,
  ): Promise<Organization> {
    const organizationRepository = AppDataSource.getRepository(Organization);

    const organization = await organizationRepository.findOne({
      where: { id: org_id, userOrganizations: { user: { id: userId } } },
    });

    if (!organization) {
      throw new ResourceNotFound(`Organization with id '${org_id}' not found`);
    }

    Object.assign(organization, update_data);

    try {
      await organizationRepository.update(organization.id, update_data);
      return organization;
    } catch (error) {
      throw error;
    }
  }

  public async generateGenericInviteLink(
    organizationId: string,
  ): Promise<string> {
    const inviteRepository = AppDataSource.getRepository(Invitation);
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new ResourceNotFound(
        `Organization with ID ${organizationId} not found`,
      );
    }
    const token = uuidv4();

    const invite = inviteRepository.create({
      token,
      isGeneric: true,
      organization: { id: organizationId },
    });

    await inviteRepository.save(invite);

    return `${frontendBaseUrl}/invite?token=${token}`;
  }

  async generateAndSendInviteLinks(
    emails: string[],
    organizationId: string,
  ): Promise<void> {
    const inviteRepository = AppDataSource.getRepository(Invitation);
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: organizationId },
    });
    console.log("here", organization);
    if (!organization) {
      throw new ResourceNotFound(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const invites = emails.map((email) => {
      const token = uuidv4();
      return inviteRepository.create({
        token,
        email: email,
        isGeneric: false,
        organization: { id: organizationId },
      });
    });

    invites.forEach((invite) => {
      const inviteLink = `${frontendBaseUrl}/invite?token=${invite.token}`;
      const emailContent = {
        userName: invite.email.split("@")[0],
        title: "Invitation to Join Organization",
        body: `<p>You have been invited to join ${organization.name} organization. Please use the following link to accept the invitation:</p><a href="${inviteLink}">Here</a>`,
      };

      const mailOptions = {
        from: "admin@mail.com",
        to: invite.email,
        subject: "Invitation to Join Organization",
        html: renderTemplate("custom-email", emailContent),
      };

      addEmailToQueue(mailOptions);
    });
    await inviteRepository.save(invites);
  }

  async addUserToOrganizationWithInvite(
    token: string,
    userId: string,
  ): Promise<string> {
    const inviteRepository = AppDataSource.getRepository(Invitation);
    const userOrganizationRepository =
      AppDataSource.getRepository(UserOrganization);
    const userRepository = AppDataSource.getRepository(User);
    const invite = await inviteRepository.findOne({
      where: { token },
      relations: ["organization"],
    });

    if (!invite) {
      throw new ResourceNotFound("Invalid or expired invite token");
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ResourceNotFound("Please register to join the organization.");
    }
    const existingMembership = await userOrganizationRepository.findOne({
      where: {
        userId: user.id,
        organizationId: invite.organization.id,
      },
    });

    if (existingMembership) {
      throw new Conflict("User already added to organization.");
    }

    const userOrganization = userOrganizationRepository.create({
      userId: user.id,
      organizationId: invite.organization.id,
      user: user,
      organization: invite.organization,
      role: user.role,
    });
    await userOrganizationRepository.save(userOrganization);

    invite.isAccepted = true;
    await inviteRepository.save(invite);

    return "User added to organization successfully";
  }
  async getAllInvite(
    page: number,
    pageSize: number,
  ): Promise<{
    message: string;
    data: Partial<Invitation>[];
    total: number;
    status_code: number;
  }> {
    const inviteRepository = AppDataSource.getRepository(Invitation);

    const [invites, total] = await inviteRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (invites.length === 0) {
      return {
        status_code: 200,
        message: "No invites yet",
        data: invites,
        total,
      };
    }

    const sentInvites = invites.map((invite) => {
      return {
        id: invite.id,
        token: invite.token,
        isAccepted: invite.isAccepted,
        isGeneric: invite.isGeneric,
        organization: invite.organization,
        email: invite.email,
      };
    });

    return {
      status_code: 200,
      message: "Successfully fetched invites",
      data: sentInvites,
      total,
    };
  }

  public async searchOrganizationMembers(criteria: {
    name?: string;
    email?: string;
  }): Promise<any[]> {
    const userOrganizationRepository =
      AppDataSource.getRepository(UserOrganization);

    const { name, email } = criteria;

    const query = userOrganizationRepository
      .createQueryBuilder("userOrganization")
      .leftJoinAndSelect("userOrganization.user", "user")
      .leftJoinAndSelect("userOrganization.organization", "organization")
      .where("1=1");

    if (name) {
      query.andWhere("LOWER(user.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    } else if (email) {
      query.andWhere("LOWER(user.email) LIKE LOWER(:email)", {
        email: `%${email}%`,
      });
    }

    const userOrganizations = await query.getMany();

    if (userOrganizations.length > 0) {
      const organizationsMap = new Map<string, any>();

      userOrganizations.forEach((userOrg) => {
        const org = userOrg.organization;
        const user = userOrg.user;

        if (!organizationsMap.has(org.id)) {
          organizationsMap.set(org.id, {
            organizationId: org.id,
            organizationName: org.name,
            organizationEmail: org.email,
            members: [],
          });
        }

        organizationsMap.get(org.id).members.push({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        });
      });

      return Array.from(organizationsMap.values());
    }

    return [];
  }

  public async createOrganizationRole(
    payload: ICreateOrgRole,
    organizationid: string,
  ) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationid },
      });

      if (!organization) {
        throw new ResourceNotFound("Organization not found");
      }

      const existingRole = await this.organizationRoleRepository.findOne({
        where: { name: payload.name, organization: { id: organizationid } },
      });

      if (existingRole) {
        throw new Conflict("Role already exists");
      }

      const role = new OrganizationRole();
      Object.assign(role, {
        name: payload.name,
        description: payload.description,
        organization: organization,
      });
      const newRole = await this.organizationRoleRepository.save(role);

      const defaultPermissions = await this.permissionRepository.find();

      const rolePermissions = defaultPermissions.map((defaultPerm) => {
        const permission = new Permissions();
        permission.category = defaultPerm.category;
        permission.permission_list = defaultPerm.permission_list;
        permission.role = newRole;
        return permission;
      });
      await this.permissionRepository.save(rolePermissions);
      return newRole;
    } catch (err) {
      throw err;
    }
  }
  public async fetchSingleRole(
    organizationId: string,
    roleId: string,
  ): Promise<null | OrganizationRole> {
    try {
      const organisation = await this.organizationRepository.findOne({
        where: { id: organizationId },
      });
      if (!organisation) {
        throw new ResourceNotFound(
          `Organisation with ID ${organizationId} not found`,
        );
      }

      const role = await this.organizationRoleRepository.findOne({
        where: { id: roleId, organization: { id: organizationId } },
        relations: ["permissions"],
      });
      if (!role) {
        return null;
      }

      return role;
    } catch (error) {
      throw error;
    }
  }

  public async fetchAllRolesInOrganization(organizationId: string) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new ResourceNotFound("Organization not found");
      }

      const roles = await this.organizationRoleRepository.find({
        where: { organization: { id: organizationId } },
        select: ["id", "name", "description"],
      });

      return roles;
    } catch (error) {
      throw error;
    }
  }

  public async updateRolePermissions(
    roleId: string,
    organizationId: string,
    newPermissions: PermissionCategory[],
  ) {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new ResourceNotFound("Organization not found");
      }

      const role = await this.organizationRoleRepository.findOne({
        where: { id: roleId, organization: { id: organizationId } },
        relations: ["permissions"],
      });

      if (!role) {
        throw new ResourceNotFound("Role not found");
      }

      const newPermissionsSet = new Set(newPermissions);

      role.permissions = role.permissions.filter((permission) =>
        newPermissionsSet.has(permission.category),
      );

      const existingCategories = new Set(
        role.permissions.map((permission) => permission.category),
      );

      for (const category of newPermissions) {
        if (!existingCategories.has(category)) {
          const newPermission = this.permissionRepository.create({
            category,
            role,
            permission_list: true,
          });
          role.permissions.push(newPermission);
        }
      }

      role.permissions = role.permissions.filter((permission) =>
        newPermissionsSet.has(permission.category),
      );

      await this.organizationRoleRepository.save(role);

      return role;
    } catch (error) {
      throw error;
    }
  }
}
