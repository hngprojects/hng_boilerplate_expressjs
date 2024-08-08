import { Router } from "express";
import { BlogCommentController } from "../controllers/blogCommentController";
import { BlogController } from "../controllers/BlogController";
// import { createBlogController } from "../controllers/createBlogController"
import { updateBlogController } from "../controllers/updateBlogController";
import { authMiddleware } from "../middleware";
import { requestBodyValidator } from "../middleware/request-validation";
import { createBlogSchema } from "../utils/request-body-validator";

const blogRouter = Router();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();

blogRouter.get("/blog/", blogController.listBlogs.bind(blogController));
blogRouter.post(
  "/blogs",
  requestBodyValidator(createBlogSchema),
  authMiddleware,
  blogController.createBlogController.bind(blogController),
);

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

blogRouter.delete(
  "/blog/:commentId",
  authMiddleware,
  blogCommentController.deleteComment.bind(blogCommentController),
);

blogRouter.get(
  "/blog/:blogId/comments",
  authMiddleware,
  blogCommentController.getAllComments.bind(blogCommentController),
);

export { blogRouter };
