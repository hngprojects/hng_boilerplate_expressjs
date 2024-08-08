import { NotificationSetting } from "../models/notificationsettings";
import { Request, Response } from "express";
import { validate } from "class-validator";

/**
 * @swagger
 * /api/v1/settings/notification-settings:
 *   put:
 *     summary: Create or update user notification settings
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
 *               email_notifications:
 *                 type: boolean
 *               push_notifications:
 *                 type: boolean
 *               sms_notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification settings created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     user_id:
 *                       type: number
 *                       example: 123
 *                     email_notifications:
 *                       type: boolean
 *                       example: true
 *                     push_notifications:
 *                       type: boolean
 *                       example: false
 *                     sms_notifications:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Error updating user notification settings
 *                 error:
 *                   type: string
 */

const CreateOrUpdateNotification = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const { email_notifications, push_notifications, sms_notifications } =
      req.body;

    let notificationSetting = await NotificationSetting.findOne({
      where: { user_id },
    });

    if (notificationSetting) {
      // Update existing setting
      notificationSetting.email_notifications = email_notifications;
      notificationSetting.push_notifications = push_notifications;
      notificationSetting.sms_notifications = sms_notifications;
    } else {
      // Create new setting
      notificationSetting = NotificationSetting.create({
        user_id,
        email_notifications,
        push_notifications,
        sms_notifications,
      });
    }

    // Validate the notificationSetting entity
    const errors = await validate(notificationSetting);
    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed",
        errors: errors,
      });
    }

    const result = await NotificationSetting.save(notificationSetting);
    res.status(200).json({ status: "success", code: 200, data: result });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error updating user notification settings",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * api/v1/settings/notification-settings/{user_id}:
 *   get:
 *     summary: Get notification settings for a user
 *     tags: [Notifications]
 *     description: Retrieves the notification settings for a specific user
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user to get notification settings for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "123456"
 *                     email_notifications:
 *                       type: boolean
 *                       example: true
 *                     push_notifications:
 *                       type: boolean
 *                       example: false
 *                     sms_notifications:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Not found
 *                 message:
 *                   type: string
 *                   example: The user with the requested id cannot be found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const GetNotification = async (req: Request, res: Response) => {
  try {
    const settings = await NotificationSetting.findOne({
      where: { user_id: String(req.params.user_id) },
    });
    if (settings === null) {
      return res.status(404).json({
        status: "Not found",
        message: "The user with the requested id cannot be found",
      });
    }
    res.status(200).json({ status: "success", code: 200, data: settings });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", code: 500, message: error.message });
  }
};

export { CreateOrUpdateNotification, GetNotification };
