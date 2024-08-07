import { Router } from "express";
import { FAQController } from "../controllers/FaqController";
import { authMiddleware } from "../middleware";

const faqRouter = Router();
const faqController = new FAQController();

faqRouter.post("/faq", authMiddleware, faqController.createFAQ);

export { faqRouter };
