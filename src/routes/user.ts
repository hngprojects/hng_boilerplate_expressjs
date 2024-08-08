import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware, checkPermissions } from "../middleware";
import { multerConfig } from "../config/multer";
import { UserRole } from "../enums/userRoles";

const upload = multerConfig.single("avatarUrl");

const userRouter = Router();
const userController = new UserController();
userRouter.get("/users/", userController.getAllUsers.bind(UserController));

userRouter.delete(
  "/users/:id",
  authMiddleware,
  userController.deleteUser.bind(userController),
);

userRouter.get(
  "/users/me",
  authMiddleware,
  userController.getProfile.bind(userController),
);

userRouter.put(
  "/users/:id",
  authMiddleware,
  upload,
  userController.updateUserProfile.bind(userController),
);

userRouter.put(
  "/users/:id/timezone",
  authMiddleware,
  userController.updateUserTimezone.bind(userController),
);

userRouter.put(
  "/users/:id/deactivate",
  authMiddleware,
  checkPermissions([UserRole.ADMIN]),
  userController.deactivateUser.bind(userController),
);

export { userRouter };
