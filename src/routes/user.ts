// src/routes/userRoutes.ts

import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers.bind(userController));
userRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };
