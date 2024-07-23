import { DataSource } from "typeorm";
import { Organization } from "../models/organization";

export const UpdateOrganizationDetails = async (
  dataSource: DataSource,
  organization_Id: string,
  updateData: Partial<Organization>
) => {
  const organizationRepository = dataSource.getRepository(Organization);

  const organization = await organizationRepository.findOne({
    where: { id: organization_Id },
  });

  if (!organization) {
    throw new Error(`Organization with ID ${organization_Id} not found`);
  }

  organizationRepository.merge(organization, updateData);
  await organizationRepository.save(organization);

  return organization;
};
