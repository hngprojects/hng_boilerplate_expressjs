import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Plan } from "./plan";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @ManyToOne(() => Plan)
  plan: Plan;

  @CreateDateColumn()
  startDate: Date;

  @Column({ type: "date" })
  renewalDate: Date;

  @Column({ default: "Active" })
  status: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
