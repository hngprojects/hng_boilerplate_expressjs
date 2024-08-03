import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Organization } from "./organization";
import { Invitation } from "./invitation";

@Entity()
export class OrgInviteToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: false })
  token: string;

  @Column()
  expires_at: Date;

  @Column({ default: true })
  isActivated: boolean;

  @ManyToOne(() => Organization)
  organization: Organization;

  @OneToMany(() => Invitation, (invitation) => invitation.orgInviteToken)
  invitations: Invitation[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
