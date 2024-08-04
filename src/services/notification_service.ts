import { Repository } from "typeorm";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { User, NotificationSettings, Notifications } from "../models";
import { INotification, INotificationService } from "../types";
import AppDataSource from "../data-source";
import log from "../utils/logger";
import { sendJsonResponse } from "../helpers";

export class NotificationService implements INotificationService {
  private usersRepository: Repository<User>;
  private notificationRepository: Repository<Notifications>;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
    this.notificationRepository = AppDataSource.getRepository(Notifications);
  }

  async getUserNotification(user_id: string): Promise<Notifications[]> {
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) throw new ResourceNotFound("User not found");

    const notifications = await this.notificationRepository.find({
      where: { user: { id: user_id } },
    });

    return notifications;
  }

  async createNotification(
    payload: INotification,
    userId: string,
  ): Promise<Notifications> {
    const user_notification = await this.getUserNotification(userId);
    const notification = await this.notificationRepository.save({
      ...payload,
      user: { id: userId },
    });

    return notification;
  }

  async isReadUserNotification(
    notificationId: string,
    userId: string,
    payload: { is_read: boolean },
  ): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user: { id: userId } },
    });

    if (!notification) {
      throw new ResourceNotFound("Notification not found");
    }
    return await this.notificationRepository.save({
      ...notification,
      is_read: payload.is_read,
    });
  }

  async readAllUserNotification(userId: string): Promise<Notifications[]> {
    const user_notifications = await this.getUserNotification(userId);
    user_notifications.forEach((notifications) => {
      notifications.is_read = true;
    });

    return await this.notificationRepository.save(user_notifications);
  }
}
