import { Router } from "express";
import { SendEmail } from "../controllers";
import { validateData } from "../middleware/validationMiddleware";
import { emailSchema } from "../schemas/email";
import { authMiddleware } from "../middleware";

const emailRoute = Router();

emailRoute.post(
  "/send-email",
  authMiddleware,
  validateData(emailSchema),
  SendEmail,
);

export { emailRoute };
