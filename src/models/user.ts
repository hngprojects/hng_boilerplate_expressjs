import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { IsEmail } from "class-validator";
import ExtendedBaseEntity from "./base-entity";
import { getIsInvalidMessage } from "../utils";
import { Otp, Profile } from ".";
import { NotificationSettings } from "./notificationSetting";

enum UserType {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  USER = "vendor",
}

@Entity({ name: "users" })
export class User extends ExtendedBaseEntity {
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

  @Column({ nullable: true })
  google_id: string;

  @Column({
    default: false,
  })
  is_verified: boolean;

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

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.USER,
  })
  user_type: UserType;

  @OneToOne(() => Profile, (profile) => profile.id)
  @JoinColumn({ name: "profile_id" })
  profile: Profile;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToOne(
    () => NotificationSettings,
    (notificationSettings) => notificationSettings.user,
  )
  notificationSettings: NotificationSettings[];
}
