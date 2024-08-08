import { NextFunction, Request, Response } from "express";
import { FAQService } from "../services";
import { UserRole } from "../enums/userRoles";
import isSuperAdmin from "../utils/isSuperAdmin";
import { Category } from "../models";

const faqService = new FAQService();

class FAQController {
  /**
   * @swagger
   * tags:
   *   name: FAQ
   *   description: FAQ management
   *
   * /faqs:
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
   * /faqs/{id}:
   *   put:
   *     summary: Update an FAQ
   *     description: Update an existing FAQ entry using the FAQ ID provided in the URL parameters and the update data in the request body. The request requires admin authorization.
   *     tags: [FAQ]
   *     parameters:
   *       - in: path
   *         name: faq_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the FAQ entry
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               question:
   *                 type: string
   *                 description: The updated question text
   *               answer:
   *                 type: string
   *                 description: The updated answer text
   *               category:
   *                 type: string
   *                 description: The updated category
   *             example:
   *               question: "Updated question?"
   *               answer: "Updated answer."
   *               category: "General"
   *     responses:
   *       200:
   *         description: The FAQ has been successfully updated.
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
   *                   example: The FAQ has been successfully updated.
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "123"
   *                     question:
   *                       type: string
   *                       example: "Updated question?"
   *                     answer:
   *                       type: string
   *                       example: "Updated answer."
   *                     category:
   *                       type: string
   *                       example: "General"
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-01-01T00:00:00.000Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2023-01-02T00:00:00.000Z"
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *       400:
   *         description: Invalid request data or an error occurred while processing the request.
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
   *       403:
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
   *       404:
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
   *                   example: FAQ entry with ID {faq_id} not found.
   *                 status_code:
   *                   type: integer
   *                   example: 404
   */

  public async updateFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const faqId = req.params.id;
      const { question, answer, category } = req.body;

      if (!question || !answer || !category) {
        return res.status(400).json({
          status_code: 400,
          success: false,
          message: "Invalid request data",
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
        success: true,
        message: "The FAQ has been successfully updated.",
        data: faq,
        status_code: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { FAQController };
