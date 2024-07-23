import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";
import { multerConfig } from "../config/multer";

const upload = multerConfig.single("avatarUrl");

const userRouter = Router();

userRouter.get("/me", authMiddleware, UserController.getProfile);
userRouter.put("/:id", authMiddleware, upload, UserController.updateUserProfile);

export { userRouter };
