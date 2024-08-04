import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { IsBoolean } from "class-validator";
import ExtendedBaseEntity from "./base-entity";
import { User } from "./user";

@Entity()
export class Notifications extends ExtendedBaseEntity {
  @Column({ nullable: false })
  @IsBoolean()
  message: string;

  @IsBoolean()
  @Column({ nullable: false, default: false })
  is_read: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
