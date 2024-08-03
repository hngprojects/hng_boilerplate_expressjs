import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { IsBoolean, IsUUID } from "class-validator";
import ExtendedBaseEntity from "./base-entity";
import { User } from "./user";

@Entity()
@Unique(["user_id"])
export class NotificationSettings extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  @IsUUID()
  user_id: string;

  // mobile notifications
  @Column({ default: true })
  @IsBoolean()
  mobile_notifications: boolean;

  // email notifications
  @Column({ default: false })
  @IsBoolean()
  email_notifications_activity_workspace: boolean;

  @Column({ default: false })
  @IsBoolean()
  email_notifications_always_send_email: boolean;

  @Column({ default: true })
  @IsBoolean()
  email_notifications_email_digests: boolean;

  @Column({ default: true })
  @IsBoolean()
  email_notifications_announcement__and_update_emails: boolean;

  // slack notifications
  @Column({ default: true })
  @IsBoolean()
  slack_notifications_activity_workspace: boolean;

  @Column({ default: true })
  @IsBoolean()
  slack_notifications_always_send_email: boolean;

  @Column({ default: true })
  @IsBoolean()
  slack_notifications_email_digests: boolean;

  @Column({ default: false })
  @IsBoolean()
  slack_notifications_announcement__and_update_emails: boolean;

  @OneToOne(() => User, (user) => user.notificationSettings)
  user: User;
}
