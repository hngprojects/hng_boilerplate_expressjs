import { CreateOrUpdateNotification, GetNotification } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware";

const notificationsettingsRouter = Router();

notificationsettingsRouter.put(
  "/settings/notification-settings",
  authMiddleware,
  CreateOrUpdateNotification,
);
notificationsettingsRouter.get(
  "/settings/notification-settings/:user_id",
  authMiddleware,
  GetNotification,
);

export { notificationsettingsRouter };
