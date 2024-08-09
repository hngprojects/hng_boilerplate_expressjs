import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./user";
import { Organization } from "./organization";
import { UserRole } from "../enums/userRoles";
import ExtendedBaseEntity from "./extended-base-entity";

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
    enum: UserRole,
  })
  role: UserRole;
}
