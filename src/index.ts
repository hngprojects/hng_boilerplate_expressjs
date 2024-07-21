import "reflect-metadata";
import express, { Express, Request, Response } from "express";
const app: Express = express();
app.use(express.json());
import dotenv from "dotenv"
dotenv.config()

import { authenticateJWT } from './middleware/auth'
import { NotificationSetting } from './entitiy/NotificationSetting'
import config from "./ormconfig";
import { DataSource } from "typeorm";
const dataSource = new DataSource(config);

// TO validate all required fields in post /api/notification-settings
interface NotificationSettings {
  user_id: number;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
}

const requiredFields: (keyof NotificationSettings)[] = [
  'user_id',
  'email_notifications',
  'push_notifications',
  'sms_notifications'
];

const validateFields = (body: Partial<NotificationSettings>) => {
  const missingFields = requiredFields.filter(field => body[field] === undefined);

  if (missingFields.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  return { valid: true };
};

dataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
  const notificationSettingRepository = dataSource.getRepository(NotificationSetting)


  app.get("/", async (req: Request, res: Response) => {
    res.send("Hello world");
  });

  // Create notification setting
  app.post("/api/notification-settings", authenticateJWT, async (req: Request, res: Response) => {
    try {

      const validation = validateFields(req.body);

      if (!validation.valid) {
        return res.status(400).json({ status: "error", code: 400, message: validation.message });
      }
      const { user_id } = req.body;

      // Check if a notification setting already exists for this user_id
      const existingSetting = await notificationSettingRepository.findOne({ where: { user_id } });

      if (existingSetting) {
        return res.status(409).json({ status: "error", code: 409, message: "Notification settings for this user already exist." });
      }

      const newSetting = notificationSettingRepository.create(req.body);
      const result = await notificationSettingRepository.save(newSetting);
      console.log(result)
      res.status(200).json({ status: "success", code: 200, data: result });
    } catch (error) {
      console.log("there is an error", error)
      res.status(500).json({ status: "error", code: 500, message: "Error creating user notification" });
    }
  });

  // Get notification setting
  app.get("/api/notification-settings/:user_id", authenticateJWT, async (req: Request, res: Response) => {
    try {
      const settings = await notificationSettingRepository.findOne({ where: { user_id: String(req.params.user_id) } });
      if (settings === null) {
        return res.status(404).json({ status: "Not found", message: "The user with the requested id cannot be found" })
      }
      res.status(200).json({ status: "success", code: 200, data: settings });

    } catch (error) {
      res.status(500).json({ status: "error", code: 500, message: error.message });
    }
  });

  app.listen(process.env.PORT || 8080, () => {
    console.info(`Server is listening on port ${process.env.PORT || 8080}`);
  });

}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
})

