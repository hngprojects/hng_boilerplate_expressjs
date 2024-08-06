import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import ExtendedBaseEntity from "./base-entity";
import { User } from "./user";

@Entity()
export class Otp extends ExtendedBaseEntity {
  @Column()
  token: string;

  @Column()
  expiry: Date;

  @OneToOne(() => User, (user) => user.otp)
  @JoinColumn({ name: "user_id" })
  user: User;
}
