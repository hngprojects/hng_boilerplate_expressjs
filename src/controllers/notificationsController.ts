import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notification_service";
import { sendJsonResponse } from "../helpers";

const notificationService = new NotificationService();

const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const notifications = await notificationService.getUserNotification(
    req.params.user_id,
  );
  sendJsonResponse(
    res,
    200,
    "Notifications fetched successfully",
    notifications,
  );
};

export { getNotifications };
