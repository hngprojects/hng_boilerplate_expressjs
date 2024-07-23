import { signUp, verifyOtp, login } from "../controllers/auth.controller";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", login);

export default authRoute;
