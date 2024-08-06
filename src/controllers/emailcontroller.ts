import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import AppDataSource from "../data-source";
import { User } from "../models";
import { EmailService } from "../services";
import { EmailQueuePayload } from "../types";

const emailService = new EmailService();

export const SendEmail = asyncHandler(async (req: Request, res: Response) => {
  const { template_id, recipient, variables } = req.body;
  const payload: EmailQueuePayload = {
    templateId: template_id,
    recipient,
    variables,
  };

  await emailService.queueEmail(payload);

  return res.status(200).json({
    success: true,
    status_code: 200,
    message: "Email sending request accepted",
  });
});
