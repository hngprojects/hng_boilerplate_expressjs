import { Request, Response } from "express";
import { EmailService } from "../services";
import { EmailQueuePayload } from "../types";
import { User } from "../models";
import AppDataSource from "../data-source";

const emailService = new EmailService();

export const SendEmail = async (req: Request, res: Response) => {
  const { template_id, recipient, variables } = req.body;
  if (!template_id || !recipient) {
    return res.status(400).json({
      success: false,
      status_code: 400,
      message: "Invalid input. Template ID and recipient are required.",
    });
  }

  const payload: EmailQueuePayload = {
    templateId: template_id,
    recipient,
    variables,
  };

  try {
    const availableTemplates: {}[] = await emailService.getEmailTemplates();
    const templateIds = availableTemplates.map(
      (template: { templateId: string }) => template.templateId,
    );

    if (!templateIds.includes(template_id)) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Template not found",
        available_templates: templateIds,
      });
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: payload.recipient },
    });
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     status_code: 404,
    //     message: "User not found",
    //   });
    // }

    await emailService.queueEmail(payload, user);
    await emailService.sendEmail(payload);

    return res.status(202).json({
      message: "Email sending request accepted and is being processed.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await emailService.getEmailTemplates();
    return res.status(200).json({ message: "Available templates", templates });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
