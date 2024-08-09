import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { IsBoolean, IsUUID } from "class-validator";
import ExtendedBaseEntity from "./extended-base-entity";

@Entity()
@Unique(["user_id"])
export class NotificationSetting extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsUUID()
  user_id: string;

  @Column()
  @IsBoolean()
  email_notifications: boolean;

  @Column()
  @IsBoolean()
  push_notifications: boolean;

  @Column()
  @IsBoolean()
  sms_notifications: boolean;
}
