import { Request, Response } from "express";
import { editComment, createComment } from "../services/blogComment.services";

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

  async editComment(req: Request, res: Response) {
    try {
      //get the commentId
      const commentId: number = Number(req?.params?.commentId || 0);

      if (!commentId)
        return res.status(403).json({
          status: "unsuccessful",
          message: "Invalid comment ID",
          status_code: 403,
        });

      //get the content
      const { content } = req.body;

      if (content?.toString()?.trim() === "")
        return res.status(403).json({
          status: "unsuccessful",
          message: "Comment content must be provided and cannot be empty",
          status_code: 403,
        });

      //call the function to edit the comment
      const editedComment = await editComment(commentId, content as string);

      //return success
      return res.status(201).json({
        status: "successful",
        message: "Comment edited successfully",
        data: editedComment,
        status_code: 200,
      });
    } catch (error: any) {
      //check error message
      if (error.message === "COMMENT_NOT_FOUND") {
        return res.status(404).json({
          status: "unsuccessful",
          message: "The comment you are trying to edit does not exist",
          status_code: 404,
        });
      } else if (error.message === "TIME_NOT_OK") {
        return res.status(403).json({
          status: "unsuccessful",
          message:
            "You cannot edit or create a comment within 30 minutes of its initial creation or last update.",
          status_code: 403,
        });
      } else {
        return res.status(500).json({
          status: "unsuccessful",
          message: "Failed to edit comment. Please try again later.",
          status_code: 500,
        });
      }
    }
  }
}
