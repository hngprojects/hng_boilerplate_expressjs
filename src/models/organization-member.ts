import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";
import { Organization } from "./organization";
import { OrganizationRole } from "./organization-role.entity";
import { Profile } from "./profile";
import { User } from "./user";

@Entity()
export class OrganizationMember extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.organizationMembers)
  user_id: User;

  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationMembers,
  )
  organization_id: Organization;

  @ManyToOne(() => OrganizationRole, (role) => role.organizationMembers)
  role: OrganizationRole;

  @ManyToOne(() => Profile)
  profile_id: Profile;
}
