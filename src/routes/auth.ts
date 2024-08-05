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

authRoute.post("/auth/register", validateData({ body: signUpSchema }), signUp);
authRoute.post(
  "/auth/verify-otp",
  validateData({ body: otpSchema }),
  verifyOtp,
);
authRoute.post("/auth/login", validateData({ body: loginSchema }), login);

export { authRoute };
