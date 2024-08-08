import { Router } from "express";
import { subscribeToNewsletter, restoreNewsletterSubscription, getAllNewsletter } from "../controllers/NewsLetterSubscriptionController";
import { authMiddleware, adminOnly, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";

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
