import { signUpSchema, otpSchema, loginSchema } from "../schemas/user";
import { validateData } from "../middleware/validationMiddleware";
import { signUp, verifyOtp } from "../controllers";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/auth/register", validateData(signUpSchema), signUp);
authRoute.post("/auth/verify-otp", validateData(otpSchema), verifyOtp);
authRoute.post("/auth/login", validateData(loginSchema), signUp);

export { authRoute };
