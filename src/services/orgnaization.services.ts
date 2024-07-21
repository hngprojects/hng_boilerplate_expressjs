import { AppDataSource } from "../data-source";
import { User } from "../models";
import { Organization } from "../models/organization";
import { UserOrganization } from "../models/userOrganization";
import { IOrganizationCreation, IOrganizationService } from "../types";

export class OrganizationService implements IOrganizationService {
  public async createOrganization(id: string, payload: IOrganizationCreation): Promise<Object>{
      try {
        const {name, description} = payload;
        const organizationRepository = AppDataSource.getRepository(Organization);
        const userRepository = AppDataSource.getRepository(User);
        const userOrgRepository = AppDataSource.getRepository(UserOrganization);
        const user = await userRepository.findOne({
          where: { id },
          relations: ["organizations"]
        });    

        if (!user) return null
        
        const newOrganization = new Organization();
        newOrganization.name = name;
        newOrganization.description = description;
        
        const createdOrganization = await organizationRepository.save(newOrganization);
        
        if (!createdOrganization) {
          return {message: "null"}
        }

        const newUserOrg = new UserOrganization();
        newUserOrg.user = user;
        newUserOrg.organization = createdOrganization

        await userOrgRepository.save(newUserOrg)
        
        return createdOrganization;
      } catch (err) {
        throw new Error(err)
      }
  }

    public async deleteOrganization(id: string): Promise<Organization | null> {
      // const organizationRepository = AppDataSource.getRepository(Organization);
      // const organization = await organizationRepository.findOne({
      //   where: { id },
      //   relations: ["users"],
      // });

      // if (!organization) return null

      // organization.users = [];
      // await organizationRepository.save(organization);

      // const deletedOrganization = await organizationRepository.remove(organization);

      // return deletedOrganization;
      return null
    }

    public async getOrganization(id: string): Promise<Organization | null> {
      const organizationRepository = AppDataSource.getRepository(Organization);
      const organization = await organizationRepository.findOne({
        where: { id },
        relations: ["users"],
      });

      if (!organization) return null

      return organization;
    }
}
