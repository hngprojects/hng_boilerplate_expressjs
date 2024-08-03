// src/controllers/UserController.ts
import { Request, Response, NextFunction } from "express";
import { HelpService } from "../services";
import { sendJsonResponse } from "../helpers";

const helpService = new HelpService();

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

const createTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, content, author } = req.body;

    const { article, message } = await helpService.create(
      title,
      content,
      author,
    );
    sendJsonResponse(res, 201, message, { article });
  } catch (error) {
    next(error);
  }
};

const getAllTopics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { articles, message } = await helpService.getAll();
    sendJsonResponse(res, 200, message, { articles });
  } catch (error) {
    next(error);
  }
};

const getTopicById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;

    const { article, message } = await helpService.getTopicById(id);
    sendJsonResponse(res, 201, message, { article });
  } catch (error) {
    next(error);
  }
};

const deleteTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;

    const { article, message } = await helpService.delete(id);
    sendJsonResponse(res, 202, message, { article });
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, content, author } = req.body;
    const id = req.params.id;

    const { article, message } = await helpService.update(
      id,
      title,
      content,
      author,
    );
    sendJsonResponse(res, 201, message, { article });
  } catch (error) {
    next(error);
  }
};

export { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic };
