import AppDataSource from "../data-source";
import { Organization } from "../models/organization";

export const UpdateOrganizationDetails = async (
  organizationId: string,
  updateData: Partial<Organization>,
) => {
  const organizationRepository = AppDataSource.getRepository(Organization);

  const organization = await organizationRepository.findOne({
    where: { id: organizationId },
  });

  if (!organization) {
    throw new Error(`Organization with ID ${organizationId} not found`);
  }

  organizationRepository.merge(organization, updateData);
  await organizationRepository.save(organization);

  return organization;
};
