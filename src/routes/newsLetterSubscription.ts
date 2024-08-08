import { Router } from "express";
import {
  subscribeToNewsletter,
  unSubscribeToNewsletter,
} from "../controllers/NewsLetterSubscriptionController";
import { authMiddleware } from "../middleware";

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

export { newsLetterSubscriptionRoute };
