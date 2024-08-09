import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from ".";
import { BillingPlan } from "./billing-plan";
import ExtendedBaseEntity from "./extended-base-entity";
import { OrganizationMember } from "./organization-member";
import { OrganizationRole } from "./organization-role.entity";
import { Payment } from "./payment";
import { Product } from "./product";
import { UserOrganization } from "./user-organisation";

@Entity()
export class Organization extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  state: string;

  @Column("text", { nullable: true })
  description: string;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column("uuid")
  owner_id: string;

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.organization,
  )
  userOrganizations: UserOrganization[];

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];

  @OneToMany(() => Payment, (payment) => payment.organization)
  payments: Payment[];

  @OneToMany(() => BillingPlan, (billingPlan) => billingPlan.organization)
  billingPlans: BillingPlan[];

  @OneToMany(() => Product, (product) => product.org, { cascade: true })
  products: Product[];

  @OneToMany(() => OrganizationRole, (role) => role.organization, {
    eager: false,
  })
  role: OrganizationRole;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.organization_id,
  )
  organizationMembers: OrganizationMember[];

  @BeforeInsert()
  generateSlug() {
    this.slug = uuidv4();
  }
}
