import { CreateOrUpdateNotification, GetNotification } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware";

const notificationRouter = Router();

notificationRouter.put(
  "/settings/notification-settings",
  authMiddleware,
  CreateOrUpdateNotification,
);
notificationRouter.get(
  "/settings/notification-settings/:user_id",
  authMiddleware,
  GetNotification,
);

export { notificationRouter };
