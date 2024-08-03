import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Organization } from "./organization";
import { OrgInviteToken } from "./orgInviteToken"; // Import the OrgInviteToken model

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: false })
  token: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  email: string;

  @ManyToOne(() => OrgInviteToken)
  orgInviteToken: OrgInviteToken;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
