import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Organization } from "./organization";
import { BillingPlan } from "./billing-plan";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  billingPlanId: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentServiceId: string | null;

  @Column({
    type: "enum",
    enum: ["pending", "completed", "failed"],
  })
  status: "pending" | "completed" | "failed";

  @Column({
    type: "enum",
    enum: ["stripe", "flutterwave", "lemonsqueezy", "paystack"],
  })
  provider: "stripe" | "flutterwave" | "lemonsqueezy" | "paystack";

  @Column("uuid", { nullable: true })
  organizationId: string | null;

  @ManyToOne(() => Organization, (organization) => organization.payments, {
    nullable: true,
  })
  organization: Organization | null;

  @ManyToOne(() => BillingPlan, (billingPlan) => billingPlan.payments, {
    onDelete: "CASCADE",
  })
  billingPlan: BillingPlan;

  @Column({ nullable: true })
  description: string;

  @Column("jsonb", { nullable: true })
  metadata: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
