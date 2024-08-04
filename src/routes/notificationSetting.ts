import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, validateData } from "../middleware";
import { notificationSchema } from "../schemas/notification";

const notificationSettingRoute = Router();

notificationSettingRoute.get(
  "/notification-setting/:user_id",
  authMiddleware,
  getNotificationSettings,
);

notificationSettingRoute.patch(
  "/notification-setting/:user_id",
  authMiddleware,
  validateData(notificationSchema),
  updateNotificationSettings,
);

export { notificationSettingRoute };
