// src/routes/user.ts
import { Router } from "express";
import UserController from "../controllers/UserController";
import Orga

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));

export { userRouter };
