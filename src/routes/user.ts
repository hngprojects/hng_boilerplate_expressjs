import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";
import { multerConfig } from "../config/multer";

const upload = multerConfig.single("profile_pic_url");

const userRoute = Router();

userRoute.get("/users/me", authMiddleware, UserController.getProfile);
userRoute.put("/users/:id", authMiddleware, upload, UserController.updateUser);

export { userRoute };
