import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middleware";

const userRoute = Router();
const usercontroller = new UserController();

userRoute.get("/users/:user_id", authMiddleware, usercontroller.getUserProfile);

export { userRoute };
