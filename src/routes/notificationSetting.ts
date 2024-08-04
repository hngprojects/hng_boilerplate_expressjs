import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, validateData } from "../middleware";
import { notificationSettingSchema } from "../schemas/notification";
import { paramsSchema } from "../schemas/params";

const notificationSettingRoute = Router();

notificationSettingRoute.get(
  "/notification-setting/:user_id",
  authMiddleware,
  validateData({ params: paramsSchema }),
  getNotificationSettings,
);

notificationSettingRoute.patch(
  "/notification-setting/:user_id",
  authMiddleware,
  validateData({ body: notificationSettingSchema, params: paramsSchema }),
  updateNotificationSettings,
);

export { notificationSettingRoute };
