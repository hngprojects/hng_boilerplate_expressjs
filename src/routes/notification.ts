import { Router } from "express";
import { NotificationController } from "../controllers";
import { authMiddleware } from "../middleware";

const notificationRouter = Router();
const notificationsController = new NotificationController();

notificationRouter.get(
  "/notifications/all",
  authMiddleware,
  notificationsController.getNotificationsForUser,
);

export { notificationRouter };
