import { Request, Response } from "express";
import { BlogService } from "../services";

export class BlogController {
  private blogService = new BlogService();

  /**
   * @swagger
   * /api/v1/blog:
   *   get:
   *     summary: Get a paginated list of blogs
   *     description: Retrieve a paginated list of blog posts
   *     tags: [Blog]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of blog posts per page
   *     responses:
   *       200:
   *         description: A paginated list of blog posts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       title:
   *                         type: string
   *                         example: My First Blog
   *                       content:
   *                         type: string
   *                         example: This is the content of my first blog post.
   *                       author:
   *                         type: string
   *                         example: John Doe
   *                       published_at:
   *                         type: string
   *                         format: date-time
   *                         example: 2023-07-21T19:58:00.000Z
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     current_page:
   *                       type: integer
   *                       example: 1
   *                     per_page:
   *                       type: integer
   *                       example: 10
   *                     total_pages:
   *                       type: integer
   *                       example: 2
   *                     total_items:
   *                       type: integer
   *                       example: 15
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: bad request
   *                 message:
   *                   type: string
   *                   example: Invalid query params passed
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */
  async listBlogs(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page <= 0 || limit <= 0) {
        res.status(400).json({
          status: "bad request",
          message: "Invalid query params passed",
          status_code: 400,
        });
        return;
      }

      const { blogs, totalItems } = await this.blogService.getPaginatedblogs(
        page,
        limit,
      );

      res.json({
        status: "success",
        status_code: 200,
        data: blogs.map((blog) => ({
          title: blog.title,
          content: blog.content,
          author: blog.author,
          published_at: blog.published_at,
        })),
        pagination: {
          current_page: page,
          per_page: limit,
          total_pages: Math.ceil(totalItems / limit),
          total_items: totalItems,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }

  /**
   * @swagger
   * /api/v1/blog/user:
   *   get:
   *     summary: Get a paginated list of blogs by user
   *     description: Retrieve a paginated list of blog posts created by the authenticated user
   *     tags: [Blog]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of blog posts per page
   *     responses:
   *       200:
   *         description: A paginated list of blog posts by the user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       title:
   *                         type: string
   *                         example: My First Blog
   *                       content:
   *                         type: string
   *                         example: This is the content of my first blog post.
   *                       author:
   *                         type: string
   *                         example: John Doe
   *                       published_date:
   *                         type: string
   *                         format: date-time
   *                         example: 2023-07-21T19:58:00.000Z
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     current_page:
   *                       type: integer
   *                       example: 1
   *                     per_page:
   *                       type: integer
   *                       example: 10
   *                     total_pages:
   *                       type: integer
   *                       example: 2
   *                     total_items:
   *                       type: integer
   *                       example: 15
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: bad request
   *                 message:
   *                   type: string
   *                   example: Invalid query params passed
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */
  async listBlogsByUser(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!user || page <= 0 || limit <= 0) {
        res.status(400).json({
          status: "bad request",
          message: "Invalid query params passed",
          status_code: 400,
        });
        return;
      }

      const { blogs, totalItems } =
        await this.blogService.getPaginatedBlogsByUser(user.id, page, limit);

      res.json({
        status: "success",
        status_code: 200,
        data: blogs.map((blog) => ({
          title: blog.title,
          content: blog.content,
          author: blog.author.name,
          published_date: blog.published_at,
        })),
        pagination: {
          current_page: page,
          per_page: limit,
          total_pages: Math.ceil(totalItems / limit),
          total_items: totalItems,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }

  /**
   * @swagger
   * /api/v1/blog/{id}:
   *   delete:
   *     summary: Delete a blog post
   *     description: Delete a specific blog post by its ID
   *     tags: [Blog]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the blog post
   *     responses:
   *       200:
   *         description: Blog post deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Blog post deleted successfully
   *       404:
   *         description: Blog post not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 error:
   *                   type: string
   *                   example: Blog post not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 error:
   *                   type: string
   *                   example: Internal server error
   *                 details:
   *                   type: string
   *                   example: Error message
   */
  async deleteBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(401).json({
          status_code: 401,
          error: "Unauthorized",
        });
      }

      const deletedPost = await this.blogService.deleteBlogPost(id);
      if (!deletedPost) {
        res.status(404).json({
          status_code: 404,
          error: "Blog post not found",
        });
      }

      res.status(200).json({
        status_code: 200,
        message: "Blog post deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        error: "Internal server error",
        details: error.message,
      });
    }
  }
}
