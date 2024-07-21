import { Organization } from "../models/Organization";
import { IOrganizationService } from "../types";
import { getRepository } from 'typeorm';

export class OrganizationService implements IOrganizationService {
  public async deleteOrganization(id: string): Promise<Organization | null> {
    const organizationRepository = getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id },
      relations: ["users"],
    });

    if (!organization) return null

    organization.users = [];
    await organizationRepository.save(organization);

    await organizationRepository.remove(organization);

    return organization;
  }
}
