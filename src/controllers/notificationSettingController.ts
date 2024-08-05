import { Request, Response } from "express";
import { NotificationSettingService } from "../services";
import { sendJsonResponse } from "../helpers";
import log from "../utils/logger";
import asyncHandler from "../middleware/asyncHandler";

const notificationSettingService = new NotificationSettingService();

/**
 * @swagger
 * /api/v1/notification-setting/{user_id}:
 *   patch:
 *     summary: Update notification settings for a user
 *     tags: [Notification Settings]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile_notifications:
 *                 type: boolean
 *               email_notifications_activity_workspace:
 *                 type: boolean
 *               email_notifications_always_send_email:
 *                 type: boolean
 *               email_notifications_email_digests:
 *                 type: boolean
 *               email_notifications_announcement__and_update_emails:
 *                 type: boolean
 *               slack_notifications_activity_workspace:
 *                 type: boolean
 *               slack_notifications_always_send_email:
 *                 type: boolean
 *               slack_notifications_email_digests:
 *                 type: boolean
 *               slack_notifications_announcement__and_update_emails:
 *                 type: boolean
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
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
 *                   example: Notification settings updated successfully
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 57ed406f-8a8c-40b0-86d7-77c50ed208f0
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-05T12:36:42.768Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-05T12:40:11.649Z
 *                     deletedAt:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     user_id:
 *                       type: string
 *                       example: 3ccc7152-7a06-4e0f-ab41-5807419cd674
 *                     mobile_notifications:
 *                       type: boolean
 *                       example: false
 *                     email_notifications_activity_workspace:
 *                       type: boolean
 *                       example: false
 *                     email_notifications_always_send_email:
 *                       type: boolean
 *                       example: false
 *                     email_notifications_email_digests:
 *                       type: boolean
 *                       example: true
 *                     email_notifications_announcement__and_update_emails:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_activity_workspace:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_always_send_email:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_email_digests:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_announcement__and_update_emails:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

const updateNotificationSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const notification =
      await notificationSettingService.updateNotificationSetting(
        req.body,
        req.params.user_id,
        req.user.id,
      );
    sendJsonResponse(
      res,
      200,
      "Notification settings updated successfully",
      notification,
    );
  },
);

/**
 * @swagger
 * /api/v1/notification-setting/{user_id}:
 *   get:
 *     summary: Get notification settings for a user
 *     tags: [Notification Settings]
 *     description: Retrieves the notification settings for a specific user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch notification settings for
 *     responses:
 *       200:
 *         description: Notification settings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Notification settings fetched successfully
 *                 status_code:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 57ed406f-8a8c-40b0-86d7-77c50ed208f0
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-05T12:36:42.768Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-08-05T12:40:11.649Z
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     user_id:
 *                       type: string
 *                       example: 3ccc7152-7a06-4e0f-ab41-5807419cd674
 *                     mobile_notifications:
 *                       type: boolean
 *                       example: false
 *                     email_notifications_activity_workspace:
 *                       type: boolean
 *                       example: false
 *                     email_notifications_always_send_email:
 *                       type: boolean
 *                       example: false
 *                     email_notifications_email_digests:
 *                       type: boolean
 *                       example: true
 *                     email_notifications_announcement__and_update_emails:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_activity_workspace:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_always_send_email:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_email_digests:
 *                       type: boolean
 *                       example: true
 *                     slack_notifications_announcement__and_update_emails:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

const getNotificationSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const notification =
      await notificationSettingService.getNotificationSetting(
        req.params.user_id,
        req.user.id,
      );
    sendJsonResponse(
      res,
      200,
      "Notification settings fetched successfully",
      notification,
    );
  },
);

export { updateNotificationSettings, getNotificationSettings };
