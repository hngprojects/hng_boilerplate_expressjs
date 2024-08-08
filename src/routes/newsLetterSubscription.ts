import { Router } from "express";
import { subscribeToNewsletter, restoreNewsletterSubscription } from "../controllers/NewsLetterSubscriptionController";
import { authMiddleware, adminOnly } from "../middleware";

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

export { newsLetterSubscriptionRoute };
