import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./user";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class Profile extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
