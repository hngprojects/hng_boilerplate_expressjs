import { Router } from "express";
import {
  authenticateUserMagicLink,
  createMagicLink,
  googleAuthCall,
  login,
  signUp,
  verifyOtp,
  requestToken
} from "../controllers/authcontroller";
import { validateData } from "../middleware/validationMiddleware";
import {
  GoogleUserPayloadSchema,
  magiclinkSchema,
} from "../schemas/auth.schema";
import { loginSchema, otpSchema, signUpSchema, requestTokenSchema } from "../schemas/user";

const authRoute = Router();

authRoute.post("/auth/register", validateData({ body: signUpSchema }), signUp);
authRoute.post(
  "/auth/verify-otp",
  validateData({ body: otpSchema }),
  verifyOtp,
);
authRoute.post("auth/request/token", validateData({ body: requestTokenSchema }), requestToken);
authRoute.get("/auth/magic-link/verify", authenticateUserMagicLink);
authRoute.post("/auth/login", validateData({ body: loginSchema }), login);
authRoute.post(
  "/auth/google",
  validateData({ body: GoogleUserPayloadSchema }),
  googleAuthCall,
);

export { authRoute };
