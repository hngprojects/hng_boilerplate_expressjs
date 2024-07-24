import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Organization } from "./organization";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class Invitation extends ExtendedBaseEntity  {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expires_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Organization)
  organization: Organization;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
