// src/routes/user.ts
import { Router } from "express";
import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.get("/users/:id", UserController.getUser);
userRouter.get("/users", UserController.getAllUsers);

export default userRouter;
