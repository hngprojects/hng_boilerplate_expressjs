import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./organization";
import { Payment } from "./payment";

@Entity()
export class BillingPlan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  organizationId: string;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column()
  duration: string;

  @Column({ nullable: true })
  description: string;

  @Column("simple-array")
  features: string[];

  @ManyToOne(() => Organization, (organization) => organization.billingPlans, {
    onDelete: "CASCADE",
  })
  organization: Organization;

  @OneToMany(() => Payment, (payment) => payment.billingPlan)
  payments: Payment[];
}
