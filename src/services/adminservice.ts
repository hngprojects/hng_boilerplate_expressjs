import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Organization } from "../models/organization";
import { HttpError } from "../middleware";
import { User } from "../models";

export class AdminOrganisationService {
  public async update(
    org_id: string,
    payload: Organization,
  ): Promise<Organization> {
    const {
      name,
      email,
      industry,
      type,
      country,
      address,
      state,
      description,
    } = payload;

    const orgRepository = AppDataSource.getRepository(Organization);

    const oldOrg = await orgRepository.findOne({
      where: { id: org_id },
    });

    if (!oldOrg) {
      throw new HttpError(404, "Organization not found");
    }

    await orgRepository.update(org_id, {
      name,
      email,
      industry,
      type,
      country,
      address,
      state,
      description,
    });

    const newOrg = await orgRepository.findOne({
      where: { id: org_id },
    });
    return newOrg;
  }

  public async deleteOrganization(orgId: string): Promise<Organization> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: orgId },
    });

    if (!organization) {
      throw new HttpError(404, "Organization not found");
    }

    try {
      await organizationRepository.remove(organization);
    } catch (error) {
      throw new HttpError(500, "Deletion failed");
    }
    return organization;
  }
}

export class AdminUserService {}

export class AdminLogService {}
