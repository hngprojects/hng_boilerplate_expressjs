// src/routes/user.ts
import { Router } from "express";
import UserController from "../controllers/UserController";

import { requestPasswordReset, resetPassword } from '../controllers/passwordResetController';

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));

//Team Dataflow
//Request Token Send to email to authenticate user
userRouter.post('/request-password-reset', requestPasswordReset);

//Set a new password into the database
userRouter.post('/reset-password', resetPassword)

export { userRouter };
