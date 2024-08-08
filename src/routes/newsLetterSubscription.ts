import { Router } from "express";
import { subscribeToNewsletter } from "../controllers/NewsLetterSubscriptionController";
import { authMiddleware } from "../middleware";

const newsLetterSubscriptionRoute = Router();

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription",
  // authMiddleware,
  subscribeToNewsletter,
);

export { newsLetterSubscriptionRoute };
