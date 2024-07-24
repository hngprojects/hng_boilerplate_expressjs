import { Request, Response } from 'express';
import { BlogService } from '../services'; 


export class BlogController {
  private blogService = new BlogService();

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

      const { blogs, totalItems } =
        await this.blogService.getPaginatedblogs(page, limit);

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


}
