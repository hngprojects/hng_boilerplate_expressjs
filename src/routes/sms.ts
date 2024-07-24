import { Router } from "express"
import { sendSms } from "../controllers/SmsController"
import { authMiddleware } from "../middleware"

const smsRouter = Router()

smsRouter.post("/send", authMiddleware, sendSms)

export { smsRouter }
