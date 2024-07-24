import {
  signUp,
  verifyOtp,
  login,
  changeUserRole,
  forgotPassword,
  resetPassword,
} from "../controllers";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", login);
authRoute.post("/login", login);
authRoute.put(
  "/api/v1/organizations/:organization_id/users/:user_id/role",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  changeUserRole,
);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPassword);
export { authRoute };
