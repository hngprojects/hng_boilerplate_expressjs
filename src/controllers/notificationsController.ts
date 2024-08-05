import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

const notificationService = new NotificationService();

const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotification(
    req.params.user_id,
  );
  sendJsonResponse(
    res,
    200,
    "Notifications fetched successfully",
    notifications,
  );
});

const createNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.createNotification(
      req.body,
      req.user.id,
    );
    sendJsonResponse(
      res,
      201,
      "Notifications created successfully",
      notifications,
    );
  },
);

const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.isReadUserNotification(
      req.params.notification_id,
      req.user.id,
      req.body,
    );
    sendJsonResponse(
      res,
      200,
      "Notification updated successfully",
      notification,
    );
  },
);

const markAllNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.readAllUserNotification(
      req.user.id,
    );
    sendJsonResponse(
      res,
      200,
      "Notification updated successfully",
      notification,
    );
  },
);

const getAllUnreadNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.allUnreadNotification(
      req.user.id,
    );
    sendJsonResponse(
      res,
      200,
      "Notification updated successfully",
      notification,
    );
  },
);

const deleteAllUserNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.deleteAllUserNotification(
      req.user.id,
    );
    sendJsonResponse(
      res,
      200,
      "All Notification deleted successfully",
      notification,
    );
  },
);

export {
  getNotifications,
  createNotifications,
  markNotificationAsRead,
  markAllNotificationAsRead,
  getAllUnreadNotifications,
  deleteAllUserNotification,
};
