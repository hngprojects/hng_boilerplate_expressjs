import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";
import { updateBlogController } from "../controllers/updateBlogController";
import { BlogCommentController } from "../controllers/blogCommentController";

const blogRouter = Router();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();

blogRouter.get("/blog/", blogController.listBlogs.bind(blogController));
blogRouter.post("/create", authMiddleware, createBlogController);

blogRouter.get(
  "/blog/user",
  authMiddleware,
  blogController.listBlogsByUser.bind(blogController),
);
blogRouter.put("/:id", authMiddleware, updateBlogController);

blogRouter.delete(
  "/blog/:id",
  authMiddleware,
  blogController.deleteBlogPost.bind(blogController),
);

//endpoint to create a comment on a blog post
blogRouter.post(
  "/blog/:postId/comment",
  authMiddleware,
  blogCommentController.createComment.bind(blogCommentController),
);

//endpoint to edit a comment on a blog post
blogRouter.patch(
  "/blog/:commentId/edit-comment",
  authMiddleware,
  blogCommentController.editComment.bind(blogCommentController),
);

export { blogRouter };
