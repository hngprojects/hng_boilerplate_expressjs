import { Router } from "express"

const smsRouter = Router()

smsRouter.post("/send", authMiddleware, sendSms)

export { smsRouter }
