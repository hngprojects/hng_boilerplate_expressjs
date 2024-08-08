import { Router } from "express";
import { BlogCommentController } from "../controllers/blogCommentController";
import { BlogController } from "../controllers/BlogController";
import { authMiddleware, checkPermissions } from "../middleware";
import { requestBodyValidator } from "../middleware/request-validation";
import { createBlogSchema } from "../utils/request-body-validator";
import { UserRole } from "../enums/userRoles";

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
blogRouter.patch(
  "/blog/edit/:id",
  requestBodyValidator(createBlogSchema),
  authMiddleware,
  blogController.updateBlog.bind(blogController),
);

blogRouter.delete(
  "/blog/:id",
  authMiddleware,
  blogController.deleteBlogPost.bind(blogController),
);

blogRouter.post(
  "/blog/:postId/comment",
  authMiddleware,
  blogCommentController.createComment.bind(blogCommentController),
);

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
