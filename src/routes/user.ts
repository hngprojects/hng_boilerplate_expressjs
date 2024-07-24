import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";
import { multerConfig } from "../config/multer";

const upload = multerConfig.single("avatarUrl");

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers.bind(UserController));
userRouter.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser.bind(userController),
);
userRouter.get("/me", authMiddleware, UserController.getProfile);
userRouter.put(
  "/:id",
  authMiddleware,
  upload,
  userController.updateUserProfile.bind(userController),
);

export { userRouter };
