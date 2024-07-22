import { Router } from "express";
import UserController from "../controllers/UserController";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.get("/users/:id", userController.getUser.bind(userController));
userRouter.get("/users/:user_id/organisations", userController.getUserOrganizations.bind(userController));

export { userRouter };
