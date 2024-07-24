import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { IsEmail } from "class-validator";
import { User } from "./user";
import { Organization } from "./organization";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

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
  userId: string | null;

  @ManyToOne(() => User, (user) => user.payments, { nullable: true })
  user: User | null;

  @Column("uuid", { nullable: true })
  organizationId: string | null;

  @ManyToOne(() => Organization, (organization) => organization.payments, {
    nullable: true,
  })
  organization: Organization | null;

  @Column({ nullable: true })
  @IsEmail()
  payer_email: string;

  @Column({ nullable: true })
  description: string;

  @Column("jsonb", { nullable: true })
  metadata: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
