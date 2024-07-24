import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers";

import { BlogCommentController } from "../controllers/blogCommentController";
const blogRouter = Router();
const blogController = new BlogController();

blogRouter.post("/create", authMiddleware, createBlogController);
blogRouter.get("/", blogController.listBlogs.bind(blogController));
const blogCommentController = new BlogCommentController();

//  endpoint to create a comment on a blog post

blogRouter.post(
  "/:postID/comment",
  authMiddleware,
  blogCommentController.createComment.bind(blogCommentController),
);

export { blogRouter };
