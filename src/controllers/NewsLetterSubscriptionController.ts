import { Request, Response, NextFunction } from "express";
import { NewsLetterSubscriptionService } from "../services";
import { BadRequest, ResourceNotFound, Unauthorized } from "../middleware";

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

/**
 * @swagger
 * /api/v1/newsletter-subscription/restore/{id}:
 *   post:
 *     summary: Restore a previously deleted newsletter subscription
 *     description: Allows an admin to restore a deleted newsletter subscription so that users who unsubscribed by mistake can start receiving newsletters again.
 *     tags:
 *       - Newsletter Subscription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the deleted subscription to restore.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription successfully restored.
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
 *                   example: Subscription successfully restored.
 *       400:
 *         description: Invalid subscription ID or request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Subscription ID is missing or invalid.
 *       401:
 *         description: Unauthorized. Admin access required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Access denied. Admins only.
 *       403:
 *         description: Access denied due to insufficient permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Access denied. Not an admin.
 *       404:
 *         description: Subscription not found or already active.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Subscription not found or already active.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An error occurred while processing your request.
 */

const restoreNewsletterSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { id: subscriptionId } = req.params;
    if (!subscriptionId) {
      throw new Unauthorized("Subscription ID is missing in request body.");
    }

    const restoredSubscription = await newsLetterSubscriptionService.restoreSubscription(subscriptionId);
    if (!restoredSubscription) {
      throw new ResourceNotFound("Subscription not found or already active.");
    }

    res.status(200).json({
      status: "success",
      message: "Subscription successfully restored.",
    });
  } catch (error) {
    next(error);
  }
};


export { subscribeToNewsletter, restoreNewsletterSubscription };
