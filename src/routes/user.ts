// src/routes/user.ts
import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth"; // Middleware to check authentication

const userRouter = Router();
const userController = new UserController();


userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));
userRouter.patch("/users/:id", authMiddleware, userController.updateUserProfile.bind(userController));



export { userRouter };
