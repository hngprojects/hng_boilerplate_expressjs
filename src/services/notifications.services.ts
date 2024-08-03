import { Repository } from "typeorm";
import jwt from "jsonwebtoken";
import config from "../config";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { User, Profile, Otp, NotificationSettings } from "../models";
import {
  INotificationSettingService,
  INotificationSettingsPayload,
  IUserSignUp,
  UserType,
} from "../types";
import AppDataSource from "../data-source";
import log from "../utils/logger";

export class NotificationSettingService implements INotificationSettingService {
  private usersRepository: Repository<User>;
  private profilesRepository: Repository<Profile>;
  private notificationSettingRepository: Repository<NotificationSettings>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
    this.profilesRepository = AppDataSource.getRepository(Profile);
    this.notificationSettingRepository =
      AppDataSource.getRepository(NotificationSettings);
  }

  // TODO: It must be called when the user signup
  public async createNotification(
    payload: NotificationSettings,
    userId: string,
  ): Promise<any> {
    const {
      mobile_notifications,
      email_notifications_activity_workspace,
      email_notifications_always_send_email,
      email_notifications_email_digests,
      email_notifications_announcement__and_update_emails,
    } = payload;

    log.info(userId);

    const user_notification_setting =
      await this.notificationSettingRepository.findOne({
        where: { user_id: userId },
      });

    if (user_notification_setting) {
      user_notification_setting.mobile_notifications =
        mobile_notifications ?? true;
      email_notifications_activity_workspace ?? true;
    }
  }

  public async updateNotificationSettings(
    payload: INotificationSettingsPayload,
    userId: string,
  ): Promise<NotificationSettings> {
    const userNotificationSetting =
      await this.notificationSettingRepository.findOne({
        where: { user_id: userId },
      });
    if (userNotificationSetting) {
      // Update only the fields that are provided in the payload
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined) {
          userNotificationSetting[key] = payload[key];
        }
      });

      return await this.notificationSettingRepository.save(
        userNotificationSetting,
      );
    } else {
      // TODO: ADD VALIDATION to make sure only the fields that are provided in the payload is boolean
      const newNotificationSetting = this.notificationSettingRepository.create({
        ...payload,
      });

      return await this.notificationSettingRepository.save(
        newNotificationSetting,
      );
    }
  }
}
