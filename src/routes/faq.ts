import { Router } from "express";
import { FAQController } from "../controllers/FaqController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

const faqRouter = Router();
const faqController = new FAQController();

faqRouter.post(
  "/faqs",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  faqController.createFAQ,
);

faqRouter.patch("/faqs/:id", authMiddleware, faqController.updateFaq);

faqRouter.get("/faqs", faqController.getFaq);

faqRouter.delete(
  "/faqs/:faqId",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  faqController.deleteFaq,
);

export { faqRouter };
