import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { User } from ".";
import { v4 as uuidv4 } from "uuid";
import { UserOrganization } from "./user-organisation";
import ExtendedBaseEntity from "./extended-base-entity";
import { InviteLink } from "./invite";

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

  @Column("text", { nullable: true })
  description: string;

  // @Column("text", { nullable: false })
  // link: string;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column("uuid")
  owner_id: string;

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.organization
  )
  userOrganizations: UserOrganization[];

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];

  @OneToOne(() => InviteLink, (invitelink) => invitelink.id)
  invitelink: InviteLink;

  @BeforeInsert()
  generateSlug() {
    this.slug = uuidv4();
  }

  // @BeforeInsert()
  // setDefaultValues() {
  //   if (!this.link) {
  //     this.link = `/invite/accept/${this.id}`;
  //   }
  // }
}
