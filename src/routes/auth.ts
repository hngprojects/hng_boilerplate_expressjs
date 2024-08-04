import { Router } from "express";
import {
  authenticateUserMagicLink,
  createMagicLink,
  login,
  signUp,
  verifyOtp,
} from "../controllers/authcontroller";
import { validateData } from "../middleware/validationMiddleware";
import { magiclinkSchema } from "../schemas/auth.schema";
import { loginSchema, otpSchema, signUpSchema } from "../schemas/user";

const authRoute = Router();

authRoute.post("/auth/register", validateData(signUpSchema), signUp);
authRoute.post("/auth/verify-otp", validateData(otpSchema), verifyOtp);
authRoute.post("/auth/login", validateData(loginSchema), login);
authRoute.post(
  "/auth/magic-link",
  validateData(magiclinkSchema),
  createMagicLink,
);
authRoute.get("/auth/magic-link/verify", authenticateUserMagicLink);

export { authRoute };
