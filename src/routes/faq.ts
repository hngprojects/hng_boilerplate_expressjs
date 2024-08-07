// src/routes/help-center.ts
import { Router } from "express";
import FaqController from "../controllers/FaqController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const faqRouter = Router();
const faqController = new FaqController();

faqRouter.get("/faqs", faqController.getAllFaq.bind(faqController));
faqRouter.post("/faqs", faqController.createFaq.bind(faqController));

faqRouter.patch(
  "/faqs/:id",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  faqController.updateFaq.bind(faqController),
);

export { faqRouter };
