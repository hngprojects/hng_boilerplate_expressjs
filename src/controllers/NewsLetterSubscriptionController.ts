import { Request, Response, NextFunction } from "express";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";
import { BadRequest } from "../middleware";

const newsLetterSubscriptionService = new NewsLetterSubscriptionService();

/**
 * @swagger
 * /api/v1/newsletter-subscription:
 *   post:
 *     summary: Subscribe to the newsletter
 *     description: Allows a user to subscribe to the newsletter by providing an email address.
 *     tags:
 *       - Newsletter Subscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The user's email address for subscribing to the newsletter.
 *     responses:
 *       201:
 *         description: Subscription successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Subscriber subscription successful
 *       200:
 *         description: User is already subscribed to the newsletter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: You are already subscribed to our newsletter.
 *
 *       500:
 *         description: Internal server error. An error occurred while processing the subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An error occurred while processing your request.
 */
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
    const subscriber = await newsLetterSubscriptionService.subscribeUser(email);
    res.status(!subscriber.isSubscribe ? 201 : 200).json({
      status: "success",
      message: !subscriber.isSubscribe
        ? "Subscriber subscription successful"
        : "You are already subscribed to our newsletter",
    });
  } catch (error) {
    next(error);
  }
};

export { subscribeToNewsletter };
