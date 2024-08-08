import { Router } from "express";
import {
  VerifyUserMagicLink,
  changePassword,
  changeUserRole,
  createMagicToken,
  enable2FA,
  forgotPassword,
  googleAuthCall,
  login,
  resetPassword,
  signUp,
  verify2FA,
  verifyOtp,
} from "../controllers";
import { UserRole } from "../enums/userRoles";

import { authMiddleware, checkPermissions } from "../middleware";
import { requestBodyValidator } from "../middleware/request-validation";
import { emailSchema } from "../utils/request-body-validator";
import { enable2FASchema } from "../schema/auth.schema";

const authRoute = Router();

authRoute.post("/auth/register", signUp);
authRoute.post("/auth/verify-otp", verifyOtp);
authRoute.post("/auth/login", login);
authRoute.put(
  "/auth/organizations/:organization_id/users/:user_id/role",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  changeUserRole,
);

authRoute.post("/auth/forgot-password", forgotPassword);
authRoute.post("/auth/reset-password/:token", resetPassword);

authRoute.post("/auth/google", googleAuthCall);

authRoute.patch("/auth/change-password", authMiddleware, changePassword);

authRoute.post(
  "/auth/magic-link",
  requestBodyValidator(emailSchema),
  createMagicToken,
);
authRoute.get("/auth/magic-link/verify", VerifyUserMagicLink);
authRoute.post(
  "/auth/2fa/enable",
  requestBodyValidator(enable2FASchema),
  authMiddleware,
  enable2FA,
);
authRoute.post("/auth/2fa/verify", authMiddleware, verify2FA);

export { authRoute };
