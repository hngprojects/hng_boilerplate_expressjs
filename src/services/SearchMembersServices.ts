import AppDataSource from "../data-source";
import { User, UserOrganization, Organization } from '../models';

interface SearchCriteria {
    name?: string;
    email?: string;
}
export const searchOrganizationMembersService = async (criteria: SearchCriteria) => {
    try {
        const userOrganizationRepository = AppDataSource.getRepository(UserOrganization);
        const organizationRepository = AppDataSource.getRepository(Organization);

        const { name, email } = criteria;

        const query = userOrganizationRepository
            .createQueryBuilder("userOrganization")
            .leftJoinAndSelect("userOrganization.user", "user")
            .leftJoinAndSelect("userOrganization.organization", "organization")
            .where("1=1");

        if (name) {
            query.andWhere("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` });
        } else if (email) {
            query.andWhere("LOWER(user.email) LIKE LOWER(:email)", { email: `%${email}%` });
        }

        const userOrganizations = await query.getMany();
        
        if (userOrganizations.length > 0) {
            // Map organization details and group users by organization
            const organizationsMap = new Map<string, any>();

            userOrganizations.forEach(userOrg => {
                const org = userOrg.organization;
                const user = userOrg.user;

                if (!organizationsMap.has(org.id)) {
                    organizationsMap.set(org.id, {
                        organizationId: org.id,
                        organizationName: org.name,
                        organizationEmail: org.email,
                        members: []
                    });
                }

                organizationsMap.get(org.id).members.push({
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email
                });
            });

            return Array.from(organizationsMap.values());
        }

        return null;
    } catch (error) {
        console.error("Error in searchOrganizationMembersService:", error);
        throw error;
    }

};
