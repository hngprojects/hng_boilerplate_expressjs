import { Entity, Column, ManyToOne } from "typeorm";
import ExtendedBaseEntity from "./base-entity";
import { User } from "./user";
import { JobMode, JobType, SalaryRange } from "../types";

@Entity()
export class Job extends ExtendedBaseEntity {
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
}
