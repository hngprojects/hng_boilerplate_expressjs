import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum API_STATUS {
  OPERATIONAL = "operational",
  DEGRADED = "degraded",
  DOWN = "down",
}

@Entity({ name: "api_status" })
export class ApiStatus {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "api_group" })
  api_group: string;

  @Column({ name: "api_name" })
  api_name: string;

  @Column({ name: "status", type: "enum", enum: API_STATUS })
  status: API_STATUS;

  @Column("text", { nullable: true })
  details: string;

  @Column({ name: "response_time", type: "int", nullable: true })
  response_time: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
