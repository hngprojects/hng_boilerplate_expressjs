import { Router } from "express";
import {
  SendEmail,
  getEmailTemplates,
} from "../controllers/sendEmail.controller";
import { authMiddleware } from "../middleware";

const sendEmailRoute = Router();

sendEmailRoute.post("/send-email", authMiddleware, SendEmail);
sendEmailRoute.get("/email-templates", authMiddleware, getEmailTemplates);

export { sendEmailRoute };
