import { signUp, verifyOtp, login, changeUserRole } from "../controllers";
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
    changeUserRole
  );
export { authRoute };
