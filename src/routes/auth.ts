import { signUpSchema, otpSchema, loginSchema } from "../schemas/user";
import { validateData } from "../middleware/validationMiddleware";
import { signUp, verifyOtp, login } from "../controllers/authcontroller";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/auth/register", validateData({ body: signUpSchema }), signUp);
authRoute.post(
  "/auth/verify-otp",
  validateData({ body: otpSchema }),
  verifyOtp,
);
authRoute.post("/auth/login", validateData({ body: loginSchema }), login);

export { authRoute };
