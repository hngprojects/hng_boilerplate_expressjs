import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./organization";
import { Payment } from "./payment";
import { IsString, IsInt, Min, Max } from "class-validator";

@Entity()
export class BillingPlan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: true })
  organizationId: string;

  @Column({ type: "text", nullable: false })
  @IsString({ message: "Name must be a string" })
  name: string;

  @Column({ type: "int", nullable: false, default: 0 })
  @IsInt({ message: "Price must be an integer" })
  @Min(0, { message: "Price must be a positive number" })
  price: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  description: string;

  @Column("simple-array", { nullable: true })
  features: string[];

  @ManyToOne(() => Organization, (organization) => organization.billingPlans, {
    onDelete: "CASCADE",
  })
  organization: Organization;

  @OneToMany(() => Payment, (payment) => payment.billingPlan, {
    nullable: true,
  })
  payments: Payment[];
}
