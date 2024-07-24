import { Router } from "express"
<<<<<<< HEAD
import { sendSms } from "../controllers/SmsController"
import { authMiddleware } from "../middleware"
=======
>>>>>>> 3b86485 (feat: implement docs for product routes)

const smsRouter = Router()

smsRouter.post("/send", authMiddleware, sendSms)

export { smsRouter }
