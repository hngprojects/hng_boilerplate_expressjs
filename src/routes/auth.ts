import { Router } from "express";
import {
  authenticateUserMagicLink,
  createMagicLink,
  login,
  signUp,
  verifyOtp,
} from "../controllers/authcontroller";
import { validateData } from "../middleware/validationMiddleware";
import {
  emailSchema,
  loginSchema,
  otpSchema,
  signUpSchema,
} from "../schemas/user";

const authRoute = Router();

authRoute.post("/auth/register", validateData(signUpSchema), signUp);
authRoute.post("/auth/verify-otp", validateData(otpSchema), verifyOtp);
authRoute.post("/auth/login", validateData(loginSchema), login);
authRoute.post("/auth/magic-link", validateData(emailSchema), createMagicLink);
authRoute.get("/auth/magic-link", authenticateUserMagicLink);

export { authRoute };
