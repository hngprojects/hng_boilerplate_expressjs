import AppDataSource from "../data-source";
import { Organization, User } from "../models";
import { UserRole } from "../enums/userRoles";
import { ICreateOrganisation, IOrganisationService } from "../types";
import { HttpError } from "../middleware";
import { UserOrganization } from "../models/user-organisation";

export class OrganisationService implements IOrganisationService {
  public async createOrganisation(
    payload: ICreateOrganisation,
    userId: string
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

      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
        relations: ["userOrganizations", "userOrganizations.organization"],
      });

      user.userOrganizations.push(userOrganization);
      await AppDataSource.getRepository(User).save(user);

      return { newOrganisation };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
