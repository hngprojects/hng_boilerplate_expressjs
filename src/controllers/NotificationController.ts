import { NotificationSetting } from "../models/notification";
import { Request, Response, NextFunction } from "express";

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
        (field) => body[field] === undefined
    );

    if (missingFields.length > 0) {
        return {
            valid: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        };
    }

    return { valid: true };
};

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

        // Check if a notification setting already exists for this user_id
        const existingSetting = await NotificationSetting.findOne({
            where: { user_id },
        });

        const newSetting = NotificationSetting.create(req.body);
        const result = await NotificationSetting.save(newSetting);
        res.status(200).json({ status: "success", code: 200, data: result });

        if (existingSetting) {
            return res
                .status(409)
                .json({
                    status: "error",
                    code: 409,
                    message: "Notification settings for this user already exist.",
                });
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                status: "error",
                code: 500,
                message: "Error creating user notification",
            });
    }
};

// Get notification setting
const GetNotification = async (req: Request, res: Response) => {
    try {
        const settings = await NotificationSetting.findOne({
            where: { user_id: String(req.params.user_id) },
        });
        if (settings === null) {
            return res
                .status(404)
                .json({
                    status: "Not found",
                    message: "The user with the requested id cannot be found",
                });
        }
        res.status(200).json({ status: "success", code: 200, data: settings });
    } catch (error) {
        res.status(500).json({ status: "error", code: 500, message: error.message });
    }
};

// update notification setting
export const UpdateNotificationSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id } = req.params;
        const updateSettings = req.body;

        if (!user_id || Object.keys(updateSettings).length === 0) {
            return res.status(400).json({
                success: false,
                status_code: 400,
                message: 'Bad request: invalid parameters',
            });
        }

        const settings = await NotificationSetting.findOne({ where: { user_id } });
        if (!settings) {
            return next();
        }

        Object.assign(settings, updateSettings);
        await settings.save();

        return res.status(200).json({
            success: true,
            status_code: 200,
            message: 'Notification settings updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status_code: 500,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export { CreateNotification, GetNotification };
