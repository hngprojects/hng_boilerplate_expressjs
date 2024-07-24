import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";

import { BlogCommentController } from "../controllers/blogCommentController";
const blogRouter = Router();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();

blogRouter.post("/create", authMiddleware, createBlogController);

blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);

blogRouter.delete("/:id", blogController.deleteBlogPost.bind(blogController));

blogRouter.post(
  "/:postID/comment",
  authMiddleware,
  blogCommentController.createComment.bind(blogCommentController),
);

export { blogRouter };
