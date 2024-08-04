import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ExtendedBaseEntity from "./base-entity";
import { User } from "./user";

@Entity()
export class Otp extends ExtendedBaseEntity {
  @Column()
  token: string;

  @Column()
  expiry: Date;

  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: "user_id" })
  user: User;
}
