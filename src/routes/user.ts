import { Router } from "express";
import { updateUser } from "../controllers";
import { multerConfig } from "../config/multer";
import { authMiddleware } from "../middleware";

const upload = multerConfig.single("profile_pic_url");

const userRoute = Router();

userRoute.put("/users/:id", authMiddleware, upload, updateUser);

export { userRoute };
