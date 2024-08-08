import { NextFunction, Request, Response } from "express";
import {
  editComment,
  createComment,
  getAllComments,
} from "../services/blogComment.services";
import log from "../utils/logger";
import { HttpError, ResourceNotFound } from "../middleware";

export class BlogCommentController {
  /**
   * @swagger
   * /api/v1/blog/{blogId}/comment:
   *   post:
   *     summary: Create a comment on a blog post
   *     description: Add a new comment to a specific blog post
   *     tags: [BlogComment]
   *     parameters:
   *       - in: path
   *         name: blogId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the blog post
   *       - in: body
   *         name: content
   *         schema:
   *           type: object
   *           properties:
   *             content:
   *               type: string
   *               example: This is a test comment.
   *         required: true
   *         description: Comment content
   *     responses:
   *       201:
   *         description: Comment created successfully
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
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: Comment created successfully.
   *                 data:
   *                   type: object
   *                   properties:
   *                     content:
   *                       type: string
   *                       example: This is a test comment.
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: 2023-07-21T19:58:00.000Z
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Comment content must be provided and cannot be empty.
   *       404:
   *         description: Blog post not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: Blog not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Failed to create comment. Please try again later.
   */

  async createComment(req: Request, res: Response) {
    const blogId = req.params.blogId;
    const { content } = req.body;

    try {
      const comment = await createComment(blogId, content, req.user.id);
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

  /**
   * @swagger
   * /api/v1/blog/{commentId}/edit-comment:
   *   patch:
   *     summary: Edit a comment
   *     description: Edit an existing comment by its ID
   *     tags: [BlogComment]
   *     parameters:
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID of the comment to be edited
   *       - in: body
   *         name: content
   *         schema:
   *           type: object
   *           properties:
   *             content:
   *               type: string
   *               example: Updated comment content.
   *         required: true
   *         description: New content for the comment
   *     responses:
   *       201:
   *         description: Comment edited successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: successful
   *                 status_code:
   *                   type: integer
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: Comment edited successfully.
   *                 data:
   *                   type: object
   *                   properties:
   *                     content:
   *                       type: string
   *                       example: Updated comment content.
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: 2023-07-21T19:58:00.000Z
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Comment content must be provided and cannot be empty.
   *       403:
   *         description: Edit not allowed within 30 minutes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 403
   *                 message:
   *                   type: string
   *                   example: You cannot edit or create a comment within 30 minutes of its initial creation or last update.
   *       404:
   *         description: Comment not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: The comment you are trying to edit does not exist
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Failed to edit comment. Please try again later.
   */

  async editComment(req: Request, res: Response) {
    try {
      //get the commentId
      const commentId: number = Number(req?.params?.commentId || 0);

      if (!commentId)
        return res.status(400).json({
          status: "unsuccessful",
          message: "Invalid comment ID",
          status_code: 400,
        });

      //get the content
      const { content } = req.body;

      if (content?.toString()?.trim() === "")
        return res.status(400).json({
          status: "unsuccessful",
          message: "Comment content must be provided and cannot be empty",
          status_code: 400,
        });

      //call the function to edit the comment
      const editedComment = await editComment(commentId, content as string);

      //return success
      return res.status(201).json({
        status: "successful",
        message: "Comment edited successfully",
        data: editedComment,
        status_code: 201,
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

  /**
   * @swagger
   * /api/v1/blog/{blogId}/comments:
   *   get:
   *     summary: Get all comments for a specific blog post
   *     description: Retrieves all comments associated with the specified blog post
   *     tags: [BlogComment]
   *     parameters:
   *       - in: path
   *         name: blogId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the blog post
   *     responses:
   *       200:
   *         description: Comments retrieved successfully
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
   *                 message:
   *                   type: string
   *                   example: Comments retrieved successfully.
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       author:
   *                         type: string
   *                         example: Anonymous
   *                       text:
   *                         type: string
   *                         example: Concrete Bedfordshire Streamlined withdrawal stable
   *                       timestamp:
   *                         type: string
   *                         format: date-time
   *                         example: 2024-08-08T08:59:13.633Z
   *       404:
   *         description: Blog post not found
   *       500:
   *         description: Internal server error
   */

  async getAllComments(req: Request, res: Response, next: NextFunction) {
    const blogId = req.params.blogId;

    try {
      const comments = await getAllComments(blogId);
      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Comments retrieved successfully.",
        data: comments,
      });
    } catch (error) {
      if (error instanceof ResourceNotFound) {
        next(error);
      } else {
        next(new HttpError(500, "Internal server error"));
      }
    }
  }
}
