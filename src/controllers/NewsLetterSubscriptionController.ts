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

export { getAllNewsletter, subscribeToNewsletter };
