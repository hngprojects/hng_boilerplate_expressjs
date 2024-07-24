import { Request, Response } from "express";
import { createComment } from "../services/blogComment.services";

export class BlogCommentController {
  async createComment(req: Request, res: Response) {
    const blogId = req.params.blogId;
    const { content } = req.body;

    try {
      const comment = await createComment(blogId, content);
      res.status(201).json({
        status: "success",
        status_code: 201,
        message: "Comment created successfully.",
        data: comment,
      });
    } catch (error: any) {
      if (error.message === "Blog not found") {
        res.status(404).json({
          status: "unsuccessful",
          status_code: 404,
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "unsuccessful",
          status_code: 500,
          message: "Failed to create comment. Please try again later.",
        });
      }
    }
  }
}
