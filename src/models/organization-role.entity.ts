import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";
import { Organization } from "./organization";
import { OrganizationMember } from "./organization-member";
import { Permissions } from "./permissions.entity";

@Entity("roles")
export class OrganizationRole extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @OneToMany(() => Permissions, (permission) => permission.role, {
    eager: false,
  })
  permissions: Permissions[];

  @ManyToOne(() => Organization, (organization) => organization.role, {
    eager: false,
  })
  organization: Organization;

  @OneToMany(() => OrganizationMember, (member) => member.role)
  organizationMembers: OrganizationMember[];
}
