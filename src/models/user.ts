import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { IsEmail } from "class-validator";
import ExtendedBaseEntity from "./base-entity";
import { UserType } from "../types";
import { getIsInvalidMessage } from "../utils";

@Entity()
@Unique(["email"])
export class User extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail(undefined, { message: getIsInvalidMessage("Email") })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  is_active: boolean;

  @Column("simple-array", { nullable: true })
  backup_codes: string[];

  @Column({ nullable: true })
  attempts_left: number;

  @Column({ nullable: true })
  time_left: number;

  @Column({ nullable: true })
  secret: string;

  @Column({ default: false })
  is_2fa_enabled: boolean;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.USER,
  })
  user_type: UserType;
}
