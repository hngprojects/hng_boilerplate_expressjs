import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users", userController.getAllUsers.bind(UserController));
userRouter.delete("/users/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };