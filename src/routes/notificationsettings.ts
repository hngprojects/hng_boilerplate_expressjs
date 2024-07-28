import { CreateNotification, GetNotification } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware";

const notificationRouter = Router();

notificationRouter.post(
  "/settings/notification-settings",
  authMiddleware,
  CreateNotification,
);
notificationRouter.get(
  "/settings/notification-settings/:user_id",
  authMiddleware,
  GetNotification,
);

export { notificationRouter };
