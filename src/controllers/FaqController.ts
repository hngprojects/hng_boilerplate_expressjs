// src/controllers/UserController.ts
import { Request, Response } from "express";
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
}

export default FaqController;
