import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";
import { updateBlogController } from "../controllers/updateBlogController";
import { BlogCommentController } from "../controllers/blogCommentController";

const blogRouter = Router();
const blogController = new BlogController();
const blogCommentController = new BlogCommentController();

blogRouter.post("/create", authMiddleware, createBlogController);
blogRouter.get("/", blogController.listBlogs.bind(blogController));
blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);
blogRouter.put("/:id", authMiddleware, updateBlogController);
blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);
blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);

blogRouter.delete("/:id", blogController.deleteBlogPost.bind(blogController));
//  endpoint to create a comment on a blog post
blogRouter.post(
  "/:postId/comment",
  authMiddleware,
  blogCommentController.createComment.bind(blogCommentController),
);

//endpoint to edit a comment on a blog post
blogRouter.post(
  "/:commentId/comment",
  authMiddleware,
  blogCommentController.editComment.bind(blogCommentController),
);
export { blogRouter };
