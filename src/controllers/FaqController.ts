import { NextFunction, Request, Response } from "express";
import { FAQService } from "../services";
import { UserRole } from "../enums/userRoles";
import isSuperAdmin from "../utils/isSuperAdmin";
import { ServerError, BadRequest, HttpError } from "../middleware";

const faqService = new FAQService();

class FAQController {
  /**
   * @swagger
   * tags:
   *   name: FAQ
   *   description: FAQ management
   *
   * /api/v1/faqs:
   *   post:
   *     summary: Create a new FAQ
   *     tags: [FAQ]
   *     requestBody:
   *       description: Data required to create a new FAQ
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               question:
   *                 type: string
   *                 example: "What is organization?"
   *               answer:
   *                 type: string
   *                 example: "It's a group of people."
   *               category:
   *                 type: string
   *                 example: "general"
   *     responses:
   *       '201':
   *         description: FAQ created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 201
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "FAQ Created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "d3c9c6a1-8f1e-4e89-bb7a-087d8b6f68e5"
   *                     question:
   *                       type: string
   *                       example: "What is organization?"
   *                     answer:
   *                       type: string
   *                       example: "It's a group of people."
   *                     category:
   *                       type: string
   *                       example: "general"
   *                     createdBy:
   *                       type: string
   *                       example: "SUPER_ADMIN"
   *       '400':
   *         description: Bad Request if input data is invalid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid request data"
   *       '401':
   *         description: Unauthorized if user is not authenticated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 401
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "User not authenticated"
   *       '403':
   *         description: Forbidden if user is not a super admin
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 403
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "User is not authorized to create FAQ"
   *       '500':
   *         description: Internal Server Error if an unexpected error occurs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "An unexpected error occurred"
   */
  public async createFAQ(req: Request, res: Response, next: NextFunction) {
    try {
      const { question, answer, category } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status_code: 401,
          success: false,
          message: "User not authenticated",
        });
      }

      if (!question || !answer || !category) {
        return res.status(400).json({
          status_code: 400,
          success: false,
          message: "Invalid request data",
        });
      }

      const isAdmin = await isSuperAdmin(userId);
      if (!isAdmin) {
        return res.status(403).json({
          status_code: 403,
          success: false,
          message: "User is not authorized to create FAQ",
        });
      }

      const faq = await faqService.createFaq({
        question,
        answer,
        category,
        createdBy: UserRole.SUPER_ADMIN,
      });

      res.status(201).json({
        status_code: 201,
        success: true,
        message: "The FAQ has been successfully created.",
        data: faq,
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        success: false,
        message: error.message || "An unexpected error occurred",
      });
    }
  }

  /**
   * @swagger
   * /api/v1/faqs/{id}:
   *   put:
   *     summary: Update an existing FAQ
   *     tags: [FAQ]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the FAQ to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - question
   *               - answer
   *               - category
   *             properties:
   *               question:
   *                 type: string
   *                 example: "My new faw"
   *               answer:
   *                 type: string
   *                 example: "It's a group of people."
   *               category:
   *                 type: string
   *                 example: "general"
   *     responses:
   *       200:
   *         description: FAQ updated successfully
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
   *                   example: "FAQ updated successful"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "2d6218d5-1bda-4d62-9ba1-0c687c05aa09"
   *                     question:
   *                       type: string
   *                       example: "My new faw"
   *                     answer:
   *                       type: string
   *                       example: "It's a group of people."
   *                     category:
   *                       type: string
   *                       example: "general"
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-08-10T11:08:38.152Z"
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-08-10T11:34:00.284Z"
   *       400:
   *         description: Invalid request data
   *       401:
   *         description: Unauthorized access
   *       403:
   *         description: User is not authorized to update FAQ
   *       500:
   *         description: Internal server error
   */

  public async updateFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const faqId = req.params.id;
      const { question, answer, category } = req.body;

      if (!question || !answer || !category) {
        return res.status(400).json({
          status_code: 400,
          success: false,
          message: "Question, answer and category are required",
        });
      }
      const isAdmin = await isSuperAdmin(req.user.id);
      if (!isAdmin) {
        return res.status(403).json({
          status_code: 403,
          success: false,
          message: "Unauthorized access",
        });
      }
      const faq = await faqService.updateFaq(req.body, faqId);
      res.status(200).json({
        status_code: 200,
        message: "FAQ updated successful",
        data: faq,
      });
    } catch (error) {
      if (error instanceof BadRequest) {
        res.status(400).json({
          status_code: 400,
          message: error.message,
          data: {},
        });
      } else {
        res.status(500).json({
          status_code: 500,
          message: "Internal server error.",
          data: {},
        });
      }
      next();
    }
  }

  /**
   * @swagger
   * /api/v1/faqs:
   *   get:
   *     summary: Retrieve all FAQs
   *     description: Retrieve a list of all FAQs with their respective questions, answers, and categories.
   *     tags: [FAQ]
   *     responses:
   *       200:
   *         description: Successfully retrieved all FAQs.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: The unique identifier for the FAQ.
   *                     example: 12345
   *                   question:
   *                     type: string
   *                     description: The question part of the FAQ.
   *                     example: What is the return policy?
   *                   answer:
   *                     type: string
   *                     description: The answer part of the FAQ.
   *                     example: You can return any item within 30 days.
   *                   category:
   *                     type: string
   *                     description: The category of the FAQ.
   *                     example: Returns
   *       500:
   *         description: Internal server error.
   */
  public async getFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await faqService.getAllFaqs();
      res.status(200).json({
        status_code: 200,
        success: true,
        message: "The FAQ has been retrieved successfully.",
        data: faqs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/faqs/{faqId}:
   *   delete:
   *     summary: Delete an FAQ
   *     description: Deletes an existing FAQ entry by its ID. This endpoint requires the user to have super admin permissions.
   *     tags: [FAQ]
   *     parameters:
   *       - in: path
   *         name: faqId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the FAQ entry to delete
   *     responses:
   *       '200':
   *         description: The FAQ has been successfully deleted.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: The FAQ has been successfully deleted.
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *       '400':
   *         description: Invalid request data.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Invalid request data
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       '403':
   *         description: Unauthorized access.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Unauthorized access
   *                 status_code:
   *                   type: integer
   *                   example: 403
   *       '404':
   *         description: FAQ entry not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: FAQ entry with ID {faqId} not found.
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       '500':
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Deletion failed
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */
  public async deleteFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const { faqId } = req.params;
      if (!faqId) {
        throw new HttpError(422, "Validation failed: Valid ID required");
      }
      const deletionSuccess = await faqService.deleteFaq(faqId);

      if (!deletionSuccess) {
        throw new HttpError(404, "FAQ not found or could not be deleted");
      }
      res.status(200).json({
        success: true,
        message: "The FAQ has been successfully deleted.",
        status_code: 200,
      });
    } catch (err) {
      next(err);
    }
  }
}

export { FAQController };
