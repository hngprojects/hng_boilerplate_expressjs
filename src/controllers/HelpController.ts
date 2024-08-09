// src/controllers/UserController.ts
import { Request, Response } from "express";
import { HelpService } from "../services/help.services";
import { HttpError } from "../middleware";

/**
 * @swagger
 * tags:
 *   name: HelpCenter
 *   description: Help Center related routes
 */

/**
 * @swagger
 * /api/v1/help-center/:
 *   post:
 *     summary: SuperAdmin- Create a new help center topic
 *     tags: [HelpCenter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Topic Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     article_id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *       422:
 *         description: Validation failed
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/help-center/topics:
 *   get:
 *     summary: Get all help center topics
 *     tags: [HelpCenter]
 *     responses:
 *       201:
 *         description: Fetch Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/help-center/topics/{id}:
 *   get:
 *     summary: Get a help center topic by ID
 *     tags: [HelpCenter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     responses:
 *       201:
 *         description: Fetch Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *       422:
 *         description: Validation failed
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/help-center/topic/{:id}:
 *   delete:
 *     summary: SuperAdmin- Delete a help center topic by ID
 *     tags: [HelpCenter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     responses:
 *       201:
 *         description: Delete Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *       422:
 *         description: Validation failed
 *       403:
 *         description: Access denied! You are not an admin
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/help-center/topic/{id}:
 *   patch:
 *     summary: SuperAdmin- Update a help center topic by ID
 *     tags: [HelpCenter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Topic Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     article_id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *       422:
 *         description: Validation failed
 *       403:
 *         description: Access denied! You are not an admin
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

class HelpController {
  private helpService: HelpService;

  constructor() {
    this.helpService = new HelpService();
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, author } = req.body;

      //Validate Input
      if (!title || !content || !author) {
        throw new HttpError(
          422,
          "Validation failed: Title, content, and author are required",
        );
      }

      const topic = await this.helpService.create(title, content, author);
      res.status(201).json({
        success: true,
        message: "Topic Created Successfully",
        data: {
          article_id: topic.id,
          content: topic.content,
          author: topic.author,
          title: topic.title,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
        status_code: 201,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async getAllTopics(req: Request, res: Response): Promise<void> {
    try {
      const topics = await this.helpService.getAll();
      res.status(200).json({
        success: true,
        message: "Fetch Successful",
        data: topics,
        status_code: 200,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async getTopicById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      //Validate Input
      if (!id) {
        throw new HttpError(422, "Validation failed: Valid ID required");
      }
      const topic = await this.helpService.getTopicById(id);
      res.status(201).json({
        success: true,
        message: "Fetch Successful",
        data: topic,
        status_code: 201,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async deleteTopic(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      //Validate Input
      if (!id) {
        throw new HttpError(422, "Validation failed: Valid ID required");
      }
      await this.helpService.delete(id);
      res.status(202).json({
        success: true,
        message: "Delete Successful",
        status_code: 202,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async updateTopic(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, author } = req.body;
      const id = req.params.id;

      //Validate ID
      if (!id) {
        throw new HttpError(422, "Invalid topic id");
      }

      const topic = await this.helpService.update(id, title, content, author);
      res.status(200).json({
        success: true,
        message: "Topic Updated Successfully",
        data: {
          article_id: topic.id,
          content: topic.content,
          author: topic.author,
          title: topic.title,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
        status_code: 200,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }
}

export default HelpController;
