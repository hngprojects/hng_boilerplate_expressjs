import { Router } from "express";
import {
  getAllNewsletter,
  subscribeToNewsletter,
} from "../controllers/NewsLetterSubscriptionController";
import { UserRole } from "../enums/userRoles";
import { authMiddleware, checkPermissions } from "../middleware";

const newsLetterSubscriptionRoute = Router();

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription",
  authMiddleware,
  subscribeToNewsletter,
);

newsLetterSubscriptionRoute.get(
  "/newsletter-subscription",
  authMiddleware,
  checkPermissions([UserRole.SUPER_ADMIN]),
  getAllNewsletter,
);
export { newsLetterSubscriptionRoute };
