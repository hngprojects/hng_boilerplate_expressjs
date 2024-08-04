import { NextFunction, Request, Response } from "express";
import { NotificationSettingService } from "../services";
import { sendJsonResponse } from "../helpers";
import log from "../utils/logger";
import asyncHandler from "../middleware/asyncHandler";

const notificationSettingService = new NotificationSettingService();

const updateNotificationSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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

const getNotificationSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
