import { Router } from "express";

import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";
import { updateBlogController } from "../controllers/updateBlogController";
import { BlogCommentController } from "../controllers/blogCommentController";

const blogRouter = Router();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();

blogRouter.get("/blog/", blogController.listBlogs.bind(blogController));
blogRouter.post("/create", createBlogController);

blogRouter.get(
  "/blog/user",

  blogController.listBlogsByUser.bind(blogController),
);

//Endpoint to edit a blog post by patch based on the new Unified Backend Endpoints
blogRouter.patch("/blogs/edit/:id", updateBlogController);

blogRouter.delete(
  "/blog/:id",

  blogController.deleteBlogPost.bind(blogController),
);

//endpoint to create a comment on a blog post
blogRouter.post(
  "/blog/:postId/comment",

  blogCommentController.createComment.bind(blogCommentController),
);

//endpoint to edit a comment on a blog post
blogRouter.patch(
  "/blog/:commentId/edit-comment",

  blogCommentController.editComment.bind(blogCommentController),
);

export { blogRouter };
