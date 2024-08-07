import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { IsEmail } from "class-validator";
import ExtendedBaseEntity from "./base-entity";
import { getIsInvalidMessage } from "../utils";
import { Otp, Profile } from ".";
import { UserOrganization } from "./user-organization";
import { Job } from "./job";
import { NotificationSettings } from "./notificationSetting";
import { Notifications } from "./notifications";

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

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

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

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: "profile_id" })
  profile: Profile;

  @OneToOne(() => Otp, (otp) => otp.user)
  @JoinColumn({ name: "otp_id" })
  otp: Otp[];

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.user,
  )
  userOrganizations: UserOrganization[];

  @OneToOne(
    () => NotificationSettings,
    (notificationSettings) => notificationSettings.user,
  )
  notificationSettings: NotificationSettings[];

  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];
}
