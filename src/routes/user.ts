import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";

const userRoute = Router();

userRoute.get("/users/me", authMiddleware, UserController.getProfile);

export { userRoute };
