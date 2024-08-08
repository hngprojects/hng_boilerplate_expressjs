import { Router } from "express";
import { subscribeToNewsletter } from "../controllers/NewsLetterSubscriptionController";

const newsLetterSubscriptionRoute = Router();

newsLetterSubscriptionRoute.post(
  "/newsletter-subscription",
  subscribeToNewsletter,
);

export { newsLetterSubscriptionRoute };
