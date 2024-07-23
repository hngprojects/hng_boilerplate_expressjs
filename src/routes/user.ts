import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));
userRouter.delete("/users/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };
