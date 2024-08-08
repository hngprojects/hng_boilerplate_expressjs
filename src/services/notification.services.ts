import { Repository } from "typeorm";
import { Notification, User } from "../models";
import AppDataSource from "../data-source";

export class NotificationsService {
  private notificationRepository: Repository<Notification>;

  constructor() {
    this.notificationRepository = AppDataSource.getRepository(Notification); // Inject the repository
  }

  public async getNotificationsForUser(userId: string): Promise<any> {
    const notifications = await this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });

    const totalNotificationCount = notifications.length;
    const totalUnreadNotificationCount = notifications.filter(
      (notification) => !notification.isRead,
    ).length;

    return {
      totalNotificationCount,
      totalUnreadNotificationCount,
      notifications,
    };
  }
}
