import { Router } from "express"
<<<<<<< HEAD
<<<<<<< HEAD
import { sendSms } from "../controllers/SmsController"
import { authMiddleware } from "../middleware"
=======
>>>>>>> 3b86485 (feat: implement docs for product routes)
=======
import { sendSms } from "../controllers/SmsController"
import { authMiddleware } from "../middleware"
>>>>>>> 26b237a (fix: resolve merge conflicts)

const smsRouter = Router()

smsRouter.post("/send", authMiddleware, sendSms)

export { smsRouter }
