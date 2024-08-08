import { Router } from "express";
import {
  getAllNewsletter,
  restoreNewsletterSubscription,
  subscribeToNewsletter,
} from "../controllers/NewsLetterSubscriptionController";
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

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription/unsubscribe",
  authMiddleware,
  unSubscribeToNewsletter,
);

newsLetterSubscriptionRoute.get(
  "/newsletter-subscription",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  getAllNewsletter,
);

export { newsLetterSubscriptionRoute };
