import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";
import { User } from "./user";

export enum SalaryRange {
  below_30k = "below_30k",
  k_30k_to_50k = "30k_to_50k",
  k_50k_to_70k = "50k_to_70k",
  k_70k_to_100k = "70k_to_100k",
  k_100k_to_150k = "100k_to_150k",
  above_150k = "above_150k",
}

export enum JobType {
  full_time = "full-time",
  part_time = "part-time",
  internship = "internship",
  contract = "contract",
}

export enum JobMode {
  remote = "remote",
  onsite = "onsite",
}

@Entity()
export class Job extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: false })
  title: string;

  @Column()
  user_id: string;

  @Column("text", { nullable: false })
  description: string;

  @Column("text", { nullable: false })
  location: string;

  @Column({ type: "timestamp", nullable: false })
  deadline: Date;

  @Column({
    type: "enum",
    enum: SalaryRange,
    nullable: false,
  })
  salary_range: SalaryRange;

  @Column({
    type: "enum",
    enum: JobType,
    default: JobType.full_time,
    nullable: false,
  })
  job_type: JobType;

  @Column({
    type: "enum",
    enum: JobMode,
    default: JobMode.remote,
    nullable: false,
  })
  job_mode: JobMode;

  @Column("text", { nullable: false })
  company_name: string;

  @Column("boolean", { nullable: false, default: false })
  is_deleted: boolean;

  @ManyToOne(() => User, (user) => user.jobs, { nullable: false })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
