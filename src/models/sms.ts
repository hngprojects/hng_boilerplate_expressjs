import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import ExtendedBaseEntity from "./extended-base-entity";
import { User } from "./user";

@Entity()
export class Sms extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  phone_number: string;

  @Column()
  message: string;

<<<<<<< HEAD
  // @Column()
  // @ManyToOne(() => User, (user) => user.id)
  // sender_id: User;
=======
  @ManyToOne(() => User, (user) => user.sms)
  sender: User;
>>>>>>> 5cd6791279c3207b5195dbf6656b663f319ce03a

  @CreateDateColumn()
  createdAt: Date;
}
