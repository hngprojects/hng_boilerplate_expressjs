import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Organization } from ".";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  isGeneric: boolean;

  @Column({ default: false })
  isAccepted: boolean;

  @ManyToOne(() => Organization)
  organization: Organization;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
