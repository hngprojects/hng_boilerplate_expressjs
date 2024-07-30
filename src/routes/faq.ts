// src/routes/help-center.ts
import { Router } from "express";
import FaqController from "../controllers/FaqController";
// import { authMiddleware } from "../middleware/auth";

const faqRouter = Router();
const faqController = new FaqController();

faqRouter.get("/faqs/info", faqController.getAllFaq.bind(faqController));

faqRouter.post("/faqs", faqController.createFaq.bind(faqController));

export { faqRouter };
