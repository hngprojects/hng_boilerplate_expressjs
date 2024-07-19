import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./User";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
export class Profile extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  avatarUrl: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
