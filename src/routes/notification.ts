import { signUpSchema, otpSchema } from "../schemas/user";
import { validateData } from "../middleware/validationMiddleware";
import { updateNotificationSettings } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { validateNotificationSettingsProps } from "../middleware";

const notificationsRoute = Router();

notificationsRoute.patch(
  "/notification-setting/:user_id",
  authMiddleware,
  validateNotificationSettingsProps,
  updateNotificationSettings,
);
// authRoute.post("/auth/verify-otp", validateData(otpSchema), verifyOtp);

export { notificationsRoute };
