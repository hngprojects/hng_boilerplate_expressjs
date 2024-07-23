import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";

const blogRouter = Router();

blogRouter.post("/create", authMiddleware, createBlogController);

export { blogRouter };
