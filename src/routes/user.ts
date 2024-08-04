import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";

const userRoute = Router();

userRoute.get("/users/me", authMiddleware, UserController.getProfile);
userRoute.put("/users/me", authMiddleware, UserController.updateProfile);

export { userRoute };
