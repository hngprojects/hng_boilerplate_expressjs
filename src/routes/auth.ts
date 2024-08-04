import {
  signUpSchema,
  otpSchema,
  loginSchema,
  GoogleUserPayloadSchema,
} from "../schemas/user";
import { validateData } from "../middleware/validationMiddleware";
import {
  signUp,
  verifyOtp,
  login,
  googleAuthCall,
} from "../controllers/authcontroller";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/auth/register", validateData(signUpSchema), signUp);
authRoute.post("/auth/verify-otp", validateData(otpSchema), verifyOtp);
authRoute.post("/auth/login", validateData(loginSchema), login);
authRoute.post(
  "/auth/google",
  validateData(GoogleUserPayloadSchema),
  googleAuthCall,
);

export { authRoute };
