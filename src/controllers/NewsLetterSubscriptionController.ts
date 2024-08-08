import { Request, Response, NextFunction } from "express";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";
import { BadRequest } from "../middleware";

const newsLetterSubscriptionService = new NewsLetterSubscriptionService();

const subscribeToNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("Email is missing in request body.");
    }
    await newsLetterSubscriptionService.subscribeUser(email);
    res.status(201).json({
      status: "success",
      message: "Subscriber subscription successful",
    });
  } catch (error) {
    next(error);
  }
};

export { subscribeToNewsletter };
