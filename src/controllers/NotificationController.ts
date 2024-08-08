import { Request, Response, NextFunction } from "express";
import { NotificationsService } from "../services";
import { User } from "../models";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";

class NotificationController {
  private notificationsService: NotificationsService;
  private userRepository: Repository<User>;

  constructor() {
    this.notificationsService = new NotificationsService();
    this.userRepository = AppDataSource.getRepository(User);
  }

  public getNotificationsForUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({
          status: "fail",
          status_code: 400,
          message: "User ID is required",
        });
        return;
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({
          status: "success",
          status_code: 404,
          message: "User not found!",
        });
        return;
      }
      const notifications =
        await this.notificationsService.getNotificationsForUser(userId);

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Notifications retrieved successfully",
        data: {
          total_notification_count: notifications.totalNotificationCount,
          total_unread_notification_count:
            notifications.totalUnreadNotificationCount,
          notifications: notifications.notifications.map(
            ({ id, isRead, message, createdAt }) => ({
              notification_id: id,
              is_read: isRead,
              message,
              created_at: createdAt,
            }),
          ),
        },
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        error: error.message || "An unexpected error occurred",
      });
    }
  };
}

export { NotificationController };
