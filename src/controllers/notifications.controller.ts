import { NextFunction, Request, Response } from "express";
import { NotificationSettingService } from "../services";
import { sendJsonResponse } from "../helpers";
import { NotificationSettings } from "../models";
import log from "../utils/logger";
import asyncHandler from "../middleware/asyncHandler";

const notificationService = new NotificationSettingService();

const updateNotificationSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await notificationService.updateNotificationSettings(
      req.body,
      req.params.user_id,
    );
    sendJsonResponse(
      res,
      200,
      "Notification settings updated successfully",
      notification,
    );
  },
);

export { updateNotificationSettings };
