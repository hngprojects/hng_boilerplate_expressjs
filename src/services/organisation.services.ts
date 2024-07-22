import AppDataSource from "../data-source";
import { UserRole } from "../enums/userRoles";
import { HttpError } from "../middleware";
import { User } from "../models";
import { Organization } from "../models/organization";
import { UserOrganization } from "../models/userOrganization";
import { ICreateOrganisation, IOrganisationService } from "../types";

export class OrganisationService implements IOrganisationService {
  public async createOrganisation(payload: ICreateOrganisation, userId: string): Promise<{
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

      const user = await AppDataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: ["userOrganizations", "userOrganizations.organization"] });

      user.userOrganizations.push(userOrganization);
      await AppDataSource.getRepository(User).save(user);

      return { newOrganisation };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async deleteOrganisation(id: string): Promise<Organization | null> {
    try {
      const organizationRepository = AppDataSource.getRepository(Organization);
      const organization = await organizationRepository.findOne({
        where: { id },
        relations: ['userOrganizations']
      });


      if (!organization) return null

      await AppDataSource.transaction(async transactionalEntityManager => {
        // Delete related user organizations
        await transactionalEntityManager.delete(UserOrganization, { organizationId: id });
  
        // Delete the organization
        await transactionalEntityManager.remove(Organization, organization);
      });


      return organization;
      // return null;

    } catch(error) {
      console.log(error);
      
      throw error
    }
  }

  public async getOrganisation(id: string): Promise<Organization | null> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id },
      relations: ["userOrganizations"]
    });
    
    if (!organization) return null

    return organization;
  }
}
