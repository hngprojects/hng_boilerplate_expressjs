import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"

@Entity()
@Unique(["user_id"])
export class NotificationSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    email_notifications: boolean;

    @Column()
    push_notifications: boolean;

    @Column()
    sms_notifications: boolean;
}