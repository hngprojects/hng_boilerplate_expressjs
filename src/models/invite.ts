import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { User } from ".";
import { v4 as uuidv4 } from "uuid";
import { Organization } from "./organization";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class InviteLink extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: false })
  link: string;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Organization, (organization) => organization.id)
  organization: Organization;
}
