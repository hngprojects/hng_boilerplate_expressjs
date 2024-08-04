import {
  createNotifications,
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, validateData } from "../middleware";
import { notificationParamsSchema, paramsSchema } from "../schemas/params";
import { markAsRead, notificationSchema } from "../schemas/notification";

const notificationsRoute = Router();

notificationsRoute.get(
  "/notifications/:user_id",
  authMiddleware,
  validateData({ params: paramsSchema }),
  getNotifications,
);

notificationsRoute.post(
  "/notifications/create",
  authMiddleware,
  // TODO: update all routes to follow the new validateData
  validateData({ body: notificationSchema }),
  createNotifications,
);

notificationsRoute.patch(
  "/notifications/read/:notification_id",
  authMiddleware,
  validateData({ params: notificationParamsSchema, body: markAsRead }),
  markNotificationAsRead,
);

notificationsRoute.patch(
  "/notifications/read",
  authMiddleware,
  markAllNotificationAsRead,
);

export { notificationsRoute };
