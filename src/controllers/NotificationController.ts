import { User } from "../models";
import { NotificationSetting } from "../models/notification";
import { Request, Response } from "express";

// TO validate all required fields in post /api/notification-settings
interface NotificationSettings {
  user_id: number;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
}

const requiredFields: (keyof NotificationSettings)[] = [
  "user_id",
  "email_notifications",
  "push_notifications",
  "sms_notifications",
];
const validateFields = (body: Partial<NotificationSettings>) => {
  const missingFields = requiredFields.filter(
    (field) => body[field] === undefined,
  );

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }

  return { valid: true };
};

/**
 * @swagger
 * /api/v1/settings/nofication-settings:
 *    post:
 *      summary: Create a new notification setting
 *      tags: [notifications]
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                 schema:
 *                  type: object
 *                  properties:
 *                      user_id:
 *                          type: string
 *                          example: 123456
 *                      email_notification:
 *                          type: boolean
 *                          example: true
 *                      push_notification:
 *                          type: boolean
 *                          example: false
 *                      sms_notification:
 *                          type: boolean
 *                          example: true
 *      responses:
 *          200:
 *             description: Notification setting created successfully
 *             content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: success
 *                              notification:
 *                                  type: array
 *                                  example: []
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: Unsuccessful
 *                              message:
 *                                  type: string
 *                                  example: Notification settings was not created successfully
 *
 *          409:
 *              description: conflict - notification setting already exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: Unsuccessful
 *                              message:
 *                                  type: string
 *                                  example: Notification setting for this user already exist
 *          500:
 *              description: server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: error
 *                              message:
 *                                  type: string
 *                                  example: Server error
 *
 *
 *
 *
 */

// Create notification setting for a user
const CreateNotification = async (req: Request, res: Response) => {
  try {
    const validation = validateFields(req.body);

    if (!validation.valid) {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: validation.message });
    }
    const { user_id } = req.body;

    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    // Check if a notification setting already exists for this user_id
    const existingSetting = await NotificationSetting.findOne({
      where: { user_id },
    });

    const newSetting = NotificationSetting.create(req.body);
    const result = await NotificationSetting.save(newSetting);
    res.status(200).json({ status: "success", code: 200, data: result });

    if (existingSetting) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Notification settings for this user already exist.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error creating user notification",
    });
  }
};

/**
 * @swagger
 * /api/v1/settings/nofication-settings/{user_id}:
 *    get:
 *      summary: Get user's notification settings
 *      tags: [notifications]
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                 schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *                          example: success
 *      responses:
 *          200:
 *             description: Notification setting retrieved successfully
 *             content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: success
 *                              notification:
 *                                  type: array
 *                                  example: []
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: Unsuccessful
 *                              message:
 *                                  type: string
 *                                  example: The user with the requested id cannot found
 *          500:
 *              description: server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: error
 *                              message:
 *                                  type: string
 *                                  example: Server error
 *
 *
 *
 *
 */

// Get notification setting
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

export { CreateNotification, GetNotification };
