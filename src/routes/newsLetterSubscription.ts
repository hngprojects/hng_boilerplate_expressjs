import { Router } from "express";
import {
  getAllNewsletter,
  subscribeToNewsletter,
} from "../controllers/NewsLetterSubscriptionController";
import { authMiddleware } from "../middleware";

const newsLetterSubscriptionRoute = Router();

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription",
  authMiddleware,
  subscribeToNewsletter,
);

newsLetterSubscriptionRoute.get(
  "/newsletter",
  authMiddleware,
  getAllNewsletter,
);
export { newsLetterSubscriptionRoute };
