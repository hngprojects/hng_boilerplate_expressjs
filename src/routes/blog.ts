import { Router } from "express";
import { authMiddleware } from "../middleware";
import { createBlogController } from "../controllers/createBlogController";
import { BlogController } from "../controllers/BlogController";
import { updateBlogController } from "../controllers/updateBlogController";

const blogRouter = Router();
const blogController = new BlogController();


/**
 * @swagger
 * /api/v1/blog/create:
 *   post:
 *     summary: Create a blog post
 *     description: Allow user to create a blog post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogInput'
 *     responses:
 *       '201':
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Server error
 */

blogRouter.post("/create", authMiddleware, createBlogController);

/**
 * @swagger
 * /api/v1/blog:
 *   get:
 *     summary: Get all blog posts with pagination
 *     description: Allow user to get all blog posts with pagination (page, limit, offset)
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: offset
 *         in: query
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       '200':
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       '500':
 *         description: Server error
 */

blogRouter.get("/", blogController.listBlogs.bind(blogController));


blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);

/**
 * @swagger
 * /api/v1/blog/{id}:
 *   put:
 *     summary: Edit a blog post by ID
 *     description: Allow an author to edit a blog post by ID (requires authentication)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogInput'
 *     responses:
 *       '200':
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Server error
 */
blogRouter.put("/:id", authMiddleware, updateBlogController);
blogRouter.get(
  "/",
  authMiddleware,
  blogController.listBlogs.bind(blogController),
);

/**
 * @swagger
 * /api/v1/blog/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     description: Allow an author to delete a blog post by ID (requires authentication)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Blog post deleted successfully
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Server error
 */
blogRouter.delete("/:id", blogController.deleteBlogPost.bind(blogController));

export { blogRouter };
