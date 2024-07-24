import { Router } from "express";
import { authMiddleware } from "../middleware";
import { sendSms } from "../controllers/SmsController";

const smsRouter = Router();

smsRouter.post("/send", authMiddleware, sendSms);

export { smsRouter };
