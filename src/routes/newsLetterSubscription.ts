import { Router } from "express";
import {
  getAllNewsletter,
  restoreNewsletterSubscription,
  subscribeToNewsletter,
  restoreNewsletterSubscription,
} from "../controllers/NewsLetterSubscriptionController";
import { UserRole } from "../enums/userRoles";
import { authMiddleware, checkPermissions, adminOnly } from "../middleware";

const newsLetterSubscriptionRoute = Router();

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription",
  authMiddleware,
  subscribeToNewsletter,
);


newsLetterSubscriptionRoute.post(
  "/newsletter-subscription/restore/{id}",
  authMiddleware,
  adminOnly,
  restoreNewsletterSubscription,
);

newsLetterSubscriptionRoute.get(
  "/newsletter-subscription",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  getAllNewsletter,
);

export { newsLetterSubscriptionRoute };
