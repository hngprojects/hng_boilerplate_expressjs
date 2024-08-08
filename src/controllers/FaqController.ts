import { Request, Response, NextFunction } from "express";
import { FAQService } from "../services";
import { UserRole } from "../enums/userRoles";
import isSuperAdmin from "../utils/isSuperAdmin";

const faqService = new FAQService();

class FAQController {
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

      if (!question || answer || category) {
        return res.status(401).json({
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
        message: "FAQ Created successfully",
        data: faq,
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        success: false,
        message: "An unexpected error occured",
      });
    }
  }
}

export { FAQController };
