import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./user";
import { Organization } from "./organization";
import ExtendedBaseEntity from "./base-entity";

export enum OrgRole {
  ADMIN = "admin",
  USER = "vendor",
}

@Entity()
export class UserOrganization extends ExtendedBaseEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  organizationId: string;

  @ManyToOne(() => User, (user) => user.userOrganizations)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(
    () => Organization,
    (organization) => organization.userOrganizations,
  )
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @Column({
    type: "enum",
    enum: OrgRole,
    default: OrgRole.USER,
  })
  user_role: OrgRole;
}
