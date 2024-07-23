// src/routes/user.ts
import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";
import { checkPermissions } from "../middleware/checkUserRole";
import { UserRole } from "../enums/userRoles";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));
userRouter.put(
    "/users/:id",
    authMiddleware,
    checkPermissions([UserRole.SUPER_ADMIN]),
    userController.deleteUser.bind(userController)
    )

export { userRouter };
