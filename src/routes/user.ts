import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";

const userRouter = Router();

userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };
