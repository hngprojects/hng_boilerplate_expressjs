import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middleware/auth";
import { checkPermissions } from "../middleware/checkUserRole";
import { UserRole } from "../enums/userRoles";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));
userRouter.delete(
  "/users/:id",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  userController.deleteUser.bind(userController)
);
userRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));
userRouter.get("/me", authMiddleware, UserController.getProfile);

export { userRouter };