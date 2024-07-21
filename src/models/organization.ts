import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";
import { OrganisationInvitation } from "./organisationInvitation";

@Entity()
export class Organization extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];

  @OneToMany(() => OrganisationInvitation, (invitation) => invitation.organization)
  invitations: OrganisationInvitation[];
}
