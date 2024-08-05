import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

const notificationService = new NotificationService();

/**
 * @swagger
 * /api/v1/notifications/{user_id}:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve notifications for a specific user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
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
 *                   example: Notifications fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1234567890"
 *                       message:
 *                         type: string
 *                         example: "You have a new message"
 *                       is_read:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-01T12:00:00Z"
 */

const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotification(
    req.params.user_id,
  );
  sendJsonResponse(
    res,
    200,
    "Notifications fetched successfully",
    notifications,
  );
});

/**
 * @swagger
 * /api/v1/notifications/create:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The content of the notification
 *               is_read:
 *                 type: boolean
 *                 description: The read status of the notification
 *     responses:
 *       201:
 *         description: Notification created successfully
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
 *                   example: Notifications created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1234567890"
 *                     message:
 *                       type: string
 *                       example: "create user notification message"
 *                     is_read:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-01T12:00:00Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
const createNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await notificationService.createNotification(
      req.body,
      req.user.id,
    );
    sendJsonResponse(
      res,
      201,
      "Notifications created successfully",
      notifications,
    );
  },
);

/**
 * @swagger
 * /api/v1/notifications/{notification_id}/read:
 *   patch:
 *     summary: Mark a notification as read or unread
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_read:
 *                 type: boolean
 *                 description: Set to true to mark as read, false to mark as unread
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Notification updated successfully
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: f2d9edeb-290e-4e5e-a67c-a1316736f455
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-05T12:45:14.797Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-05T12:47:19.701Z
 *                     deletedAt:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     message:
 *                       type: string
 *                       example: timor maiores demulceo
 *                     is_read:
 *                       type: boolean
 *                       example: true
 */
const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.isReadUserNotification(
      req.params.notification_id,
      req.user.id,
      req.body,
    );
    sendJsonResponse(
      res,
      200,
      "Notification updated successfully",
      notification,
    );
  },
);

/**
 * @swagger
 * /api/v1/notifications/read:
 *   patch:
 *     summary: Mark all notifications as read for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Notification updated successfully
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: f2d9edeb-290e-4e5e-a67c-a1316736f455
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-08-05T12:45:14.797Z
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-08-05T12:47:19.701Z
 *                       deletedAt:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       message:
 *                         type: string
 *                         example: timor maiores demulceo
 *                       is_read:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const markAllNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.readAllUserNotification(
      req.user.id,
    );
    sendJsonResponse(
      res,
      200,
      "Notification updated successfully",
      notification,
    );
  },
);

/**
 * @swagger
 * /api/v1/notifications/unread:
 *   get:
 *     summary: Get all unread notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved unread notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Unread notifications retrieved successfully
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       message:
 *                         type: string
 *                         example: "conscendo contego turbo"
 *                       is_read:
 *                         type: boolean
 *                         example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getAllUnreadNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.allUnreadNotification(
      req.user.id,
    );
    sendJsonResponse(
      res,
      200,
      "Notification updated successfully",
      notification,
    );
  },
);

/**
 * @swagger
 * /api/v1/notifications/clear:
 *   delete:
 *     summary: Delete all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted all notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: All Notification deleted successfully
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

const deleteAllUserNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.deleteAllUserNotification(
      req.user.id,
    );
    sendJsonResponse(
      res,
      200,
      "All Notification deleted successfully",
      notification,
    );
  },
);

export {
  getNotifications,
  createNotifications,
  markNotificationAsRead,
  markAllNotificationAsRead,
  getAllUnreadNotifications,
  deleteAllUserNotification,
};
