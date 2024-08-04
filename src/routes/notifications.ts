import { getNotifications } from "../controllers";
import { Router } from "express";
import { authMiddleware, validateData } from "../middleware";

const notificationsRoute = Router();

notificationsRoute.get(
  "/notifications/:user_id",
  authMiddleware,
  validateData,
  getNotifications,
);

export { notificationsRoute };
