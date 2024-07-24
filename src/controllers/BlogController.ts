import { Request, Response } from "express";
import { BlogService } from "../services";

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
}
