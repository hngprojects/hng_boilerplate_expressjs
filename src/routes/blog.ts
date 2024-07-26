import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";

const blogRouter = Router();
const blogController = new BlogController();

blogRouter.post("/create", authMiddleware, createBlogController);
blogRouter.get("/", blogController.listBlogs.bind(blogController));
blogRouter.get("/user", authMiddleware, blogController.listBlogsByUser.bind(blogController));

blogRouter.delete("/:id", blogController.deleteBlogPost.bind(blogController));

export { blogRouter };

