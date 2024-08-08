import { Request, Response, NextFunction } from "express";
import { NewsLetterSubscriptionService } from "../services";
import { BadRequest, ResourceNotFound, Unauthorized } from "../middleware";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../middleware";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";

const newsLetterSubscriptionService = new NewsLetterSubscriptionService();

/**
 * @swagger
 * /api/v1/newsletter-subscription:
 *   post:
 *     summary: Subscribe to the newsletter
 *     description: Allows a user to subscribe to the newsletter by providing an email address.
 *     tags:
 *       - Newsletter
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
 *       400:
 *         description: User is already subscribed but unsubscribe.
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: You are already subscribed, please enable newsletter subscription to receive newsletter again
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
    res.status(subscriber.isNewlySubscribe ? 201 : 200).json({
      status: "success",
      message: subscriber.isNewlySubscribe
        ? "Subscriber subscription successful"
        : "You are already subscribed to our newsletter",
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

/**
 * @swagger
 * /newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     description: Allows a logedegin user to unsubscribe from the newsletter using their email address.
 *     tags:
 *       - Newsletter
 *     security:
 *       - bearerAuth: [] # Assumes you're using bearer token authentication
 *     responses:
 *       200:
 *         description: Successfully unsubscribed from the newsletter.
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
 *                   example: Successfully unsubscribed from newsletter
 *       400:
 *         description: Bad request, missing or invalid email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: You already unsubscribed to newsletter.
 *       404:
 *         description: User not subscribed ti newsletter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 status_code:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: You are not subscribed to newsletter.
 */
const unSubscribeToNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.user;
    if (!email) {
      throw new BadRequest("Email is missing in request body.");
    }
    const subscriber =
      await newsLetterSubscriptionService.unSubcribeUser(email);
    if (subscriber) {
      res.status(200).json({
        status: "success",
        message: "Successfully unsubscribed from newsletter",
      });
    }
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


/**
 * @swagger
 * /api/v1/newsletters:
 *   get:
 *     summary: Get all newsletters with pagination
 *     tags: [Newsletters]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of newsletters with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Newsletters retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "newsletterId123"
 *                       title:
 *                         type: string
 *                         example: "Weekly Update"
 *                       content:
 *                         type: string
 *                         example: "This is the content of the newsletter."
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Bad request, possibly due to invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid page or limit parameter"
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: An error occurred while fetching the newsletters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 status_code:
 *                   type: integer
 *                   example: 500
 */

  const getAllNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = req.query;
    const { data, meta } =
      await newsLetterSubscriptionService.fetchAllNewsletter({
        page: Number(page),
        limit: Number(limit),
      });

    return res.status(200).json({
      status: "",
      message: "",
      data: data,
      meta,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllNewsletter, subscribeToNewsletter, unSubscribeToNewsletter restoreNewsletterSubscription,  };
