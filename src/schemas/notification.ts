import { z } from "zod";

const notificationSchema = z
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
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Please provide at least one field to update",
  });

export { notificationSchema };
