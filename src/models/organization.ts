import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";
import { UserOrganization } from "./userOrganization";

@Entity()
export class Organization extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserOrganization, (userOrganization) => userOrganization.user, {
    cascade: true,
  })
  userOrganizations: UserOrganization[];
}
