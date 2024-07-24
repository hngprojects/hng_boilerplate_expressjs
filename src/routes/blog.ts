import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers";
import { updateBlogController } from "../controllers/updateBlogController";

const blogRouter = Router();
const blogController = new BlogController();

blogRouter.post("/create", createBlogController);
blogRouter.get("/", blogController.listBlogs.bind(blogController));
blogRouter.put("/:id", updateBlogController);

export { blogRouter };
