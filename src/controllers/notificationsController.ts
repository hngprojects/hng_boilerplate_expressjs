import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

const notificationService = new NotificationService();

/**
 * @swagger
 * /notifications/{user_id}:
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
 *                     $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
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
 * /notifications:
 *   post:
 *     summary: Create notifications
 *     description: Create new notifications for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the notification
 *               type:
 *                 type: string
 *                 description: The type of the notification
 *     responses:
 *       201:
 *         description: Notifications created successfully
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
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * /notifications/{notification_id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to mark as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_read:
 *                 type: boolean
 *                 description: The read status of the notification
 *     responses:
 *       200:
 *         description: Notification updated successfully
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
 *                   example: Notification updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
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
 * /notifications/read:
 *   put:
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
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: All notifications marked as read successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
 * /notifications/unread:
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
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Unread notifications retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
 * /notifications/clear:
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
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: All Notification deleted successfully
 *                 data:
 *                   type: object
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
