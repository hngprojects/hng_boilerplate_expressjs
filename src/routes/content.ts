import { AboutContentController } from "../controllers";
import { Router } from "express";
import { authMiddleware, checkPermissions } from "../middleware";

const contentRouter = Router();

const aboutContentController = new AboutContentController()

contentRouter.get(
  "/about",
  authMiddleware, //this middleware ensures that the user is authenticated
  checkPermissions, //this middleware checks the roles of a user
  aboutContentController.getContent
);

export { contentRouter };
