import { Repository } from "typeorm";
import {
  BadRequest,
  Conflict,
  Forbidden,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { User, NotificationSettings } from "../models";
import {
  // todo: I don't think i need to import 2 types check later
  INotificationSettingService,
  INotificationSettings,
} from "../types";
import AppDataSource from "../data-source";
import log from "../utils/logger";

export class NotificationSettingService implements INotificationSettingService {
  private usersRepository: Repository<User>;
  private notificationSettingRepository: Repository<NotificationSettings>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
    this.notificationSettingRepository =
      AppDataSource.getRepository(NotificationSettings);
  }

  public async updateNotificationSetting(
    payload: INotificationSettings,
    userId: string,
    auth_userId: string,
  ): Promise<NotificationSettings> {
    if (userId !== auth_userId) {
      throw new Conflict("You can only update your own notification settings");
    }

    const userNotificationSetting =
      await this.notificationSettingRepository.findOne({
        where: { user_id: userId },
      });

    if (!userNotificationSetting) {
      throw new ResourceNotFound("Notification setting not found");
    }
    if (userNotificationSetting) {
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined) {
          userNotificationSetting[key] = payload[key];
        }
      });

      return await this.notificationSettingRepository.save(
        userNotificationSetting,
      );
    } else {
      const newNotificationSetting = this.notificationSettingRepository.create({
        ...payload,
      });

      return await this.notificationSettingRepository.save(
        newNotificationSetting,
      );
    }
  }

  public async getNotificationSetting(
    userId: string,
    auth_userId: string,
  ): Promise<NotificationSettings> {
    if (auth_userId !== userId) {
      throw new Forbidden("You can only get your own notification settings");
    }

    const userNotificationSetting =
      await this.notificationSettingRepository.findOne({
        where: { user_id: userId },
      });

    if (!userNotificationSetting) {
      throw new ResourceNotFound("Notification setting not found");
    }
    return userNotificationSetting;
  }
}
