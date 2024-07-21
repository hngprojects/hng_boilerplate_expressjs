import {
    Entity,
    Column,
    JoinColumn,
    PrimaryColumn,
    ManyToOne
  } from "typeorm";
  import { User, Organization } from ".";

@Entity()
export class UserOrganization {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    organizationId: number;

    @ManyToOne(() => User, user => user.userOrganizations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Organization, organization => organization.userOrganizations)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @Column()
    role: string;
}