import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Preference } from "./Preference.model";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "uuid" })
  owner_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  industry: string;

  @Column()
  type: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @Column()
  state: string;

  @Column("text")
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Preference, (preference) => preference.organization)
  preferences: Preference[];
}
