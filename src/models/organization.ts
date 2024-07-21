import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, BeforeInsert } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";
import { UserOrganization } from "./userOrganization";
import {v4 as uuidv4} from "uuid"

@Entity()
export class Organization extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  state: string;

  @Column('text', { nullable: true })
  description: string;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid')
  owner_id: string;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization, {
    cascade: ['remove']
  })
  userOrganizations: UserOrganization[];

  @BeforeInsert()
  generateSlug() {
    this.slug = uuidv4();
  }
}
