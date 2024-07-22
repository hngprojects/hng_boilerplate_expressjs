import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class Job extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  user_id: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  salary: string;

  @Column()
  job_type: string;

  @Column()
  company_name: string;
}
