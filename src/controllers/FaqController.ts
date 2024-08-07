// src/controllers/UserController.ts
import { NextFunction, Request, Response } from "express";
import { FaqService } from "../services/faq.services";
import { HttpError } from "../middleware";

class FaqController {
  private faqService: FaqService;

  constructor() {
    this.faqService = new FaqService();
  }

  async createFaq(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, author } = req.body;

      //Validate Input
      if (!title || !content || !author) {
        throw new HttpError(
          422,
          "Validation failed: Title, content, and author are required",
        );
      }

      const faq = await this.faqService.create_Faq(title, content, author);
      res.status(201).json({
        success: true,
        message: "Faq Created Successfully",
        data: {
          id: faq.id,
          content: faq.content,
          author: faq.author,
          title: faq.title,
          createdAt: faq.createdAt,
          updatedAt: faq.updatedAt,
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

  async getAllFaq(req: Request, res: Response): Promise<void> {
    try {
      const faqs = await this.faqService.getAll_Faq();
      res.status(201).json({
        success: true,
        message: "Fetch Successful",
        data: faqs,
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

  /**
   * @swagger
   * /faqs/{faq_id}:
   *   put:
   *     summary: Update an FAQ entry
   *     description: Update an existing FAQ entry using the FAQ ID provided in the URL parameters and the update data in the request body.
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
   *             example:
   *               question: "Updated question?"
   *               answer: "Updated answer."
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
   *       400:
   *         description: An error occurred while processing the request.
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
   *                   example: Error message
   *                 status_code:
   *                   type: integer
   *                   example: 400
   */

  public async updateFaq(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const faqId = req.params.id;
      const payload = req.body;
      const faq = await this.faqService.updateFaq(payload, faqId);
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

export default FaqController;
