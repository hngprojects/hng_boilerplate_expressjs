import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";
import { updateBlogController } from "../controllers/updateBlogController";

const blogRouter = Router();
const blogController = new BlogController();

blogRouter.post("/create", authMiddleware, createBlogController);
blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);
blogRouter.put("/:id", authMiddleware, updateBlogController);

blogRouter.delete("/:id", blogController.deleteBlogPost.bind(blogController));

export { blogRouter };
