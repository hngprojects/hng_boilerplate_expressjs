import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";
import { checkPermissions } from "../middleware/checkUserRole";
import { UserRole } from "../enums/userRoles";

const userRouter = Router();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));
userRouter.put(
    "/users/:id",
    authMiddleware,
    checkPermissions([UserRole.SUPER_ADMIN]),
    userController.deleteUser.bind(userController)
    )
userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };
