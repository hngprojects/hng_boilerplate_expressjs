import { CreateNotification, GetNotification, UpdateNotificationSettings } from "../controllers"
import { Router } from "express";
import { authMiddleware } from "../middleware";

const notificationRouter = Router();

notificationRouter.post(
  "/notification-settings",
  authMiddleware,
  CreateNotification
);
notificationRouter
  .route("/notification-settings/:user_id")
  .get(authMiddleware, GetNotification)
  .put(authMiddleware, UpdateNotificationSettings, CreateNotification)

export { notificationRouter }