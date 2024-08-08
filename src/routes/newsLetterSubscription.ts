import { Router } from "express";
import {
  getAllNewsletter,
  subscribeToNewsletter,
  unSubscribeToNewsletter,
} from "../controllers/NewsLetterSubscriptionController";
import { UserRole } from "../enums/userRoles";
import { authMiddleware, checkPermissions } from "../middleware";

const newsLetterSubscriptionRoute = Router();

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription",
  authMiddleware,
  subscribeToNewsletter,
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
