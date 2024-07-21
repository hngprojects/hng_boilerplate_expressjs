import { CreateNotification, GetNotification } from "../controllers"
import { Router } from "express";
import { authMiddleware } from "../middleware";

const notificationRouter = Router();

notificationRouter.post(
  "/notification-settings",
  authMiddleware,
  CreateNotification
);
notificationRouter.get(
  "/notification-settings/:user_id",
  authMiddleware,
  GetNotification
);

export { notificationRouter }