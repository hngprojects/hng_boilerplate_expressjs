import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers.bind(UserController));
userRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/me", authMiddleware, UserController.getProfile);
userRouter.get("/paginate",authMiddleware, checkPermissions([UserRole.SUPER_ADMIN]), 
                            userController.getPaginatedUsers.bind(userController));

export { userRouter };