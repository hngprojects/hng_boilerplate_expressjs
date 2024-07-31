import { Router } from "express";
import {
  authenticateUserMagicLink,
  changePassword,
  changeUserRole,
  createMagicToken,
  googleAuthCall,
  login,
  signUp,
  verifyOtp,
} from "../controllers";
import { UserRole } from "../enums/userRoles";

import { authMiddleware, checkPermissions } from "../middleware";
import { requestBodyValidator } from "../middleware/request-validation";
import { emailSchema } from "../utils/request-body-validator";

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
authRoute.post("/auth/google", googleAuthCall);

authRoute.patch("/auth/change-password", authMiddleware, changePassword);

authRoute.post(
  "/auth/magic-link",
  requestBodyValidator(emailSchema),
  createMagicToken,
);
authRoute.get("/auth/magic-link", authenticateUserMagicLink);

export { authRoute };
