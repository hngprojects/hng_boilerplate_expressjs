import { z } from "zod";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const paramsSchema = z.object({
  user_id: z.string().refine((val) => uuidRegex.test(val), {
    message: "Invalid UUID format",
  }),
});

const notificationParamsSchema = z.object({
  notification_id: z.string().refine((val) => uuidRegex.test(val), {
    message: "Invalid UUID format",
  }),
});

export { paramsSchema, notificationParamsSchema };
