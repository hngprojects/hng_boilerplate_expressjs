import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ServerError, InvalidInput } from "./error";
// todo: giving error at 500 in mobile_notifications:
// has empty value in mobile_notifications but it's not parsed properly and had to change error.ts middleware
const notificationSettingsSchema = z
  .object({
    mobile_notifications: z.boolean().optional(),
    email_notifications_activity_workspace: z.boolean().optional(),
    email_notifications_always_send_email: z.boolean().optional(),
    email_notifications_email_digests: z.boolean().optional(),
    email_notifications_announcement__and_update_emails: z.boolean().optional(),
    slack_notifications_activity_workspace: z.boolean().optional(),
    slack_notifications_always_send_email: z.boolean().optional(),
    slack_notifications_email_digests: z.boolean().optional(),
    slack_notifications_announcement__and_update_emails: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Please provide at least one field to update",
  });

export function validateNotificationSettingsProps(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    notificationSettingsSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
      }));
      throw new InvalidInput(errorMessages[0].message);
    } else {
      throw new ServerError("Something went wrong");
    }
  }
}
