import {
  signUp,
  verifyOtp,
  login,
  changeUserRole,
  changePassword,
  googleAuthCall,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

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

export { authRoute };
