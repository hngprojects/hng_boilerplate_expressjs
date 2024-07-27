/**
 * @swagger
 * /api/v1/email-templates:
 *   get:
 *     tags:
 *       - Email
 *     summary: Get all email templates
 *     description: Retrieve a list of all email templates
 *     responses:
 *       200:
 *         description: The list of email templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmailTemplates'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */

/**
 * @swagger
 * /api/v1/send-email:
 *   post:
 *     tags:
 *       - Email
 *     summary: Send an email using a predefined template
 *     description: Submits an email sending request referencing a specific template.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template_id:
 *                 type: string
 *                 example: "account-activation-request"
 *               recipient:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               variables:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Activate Your Account"
 *                   activationLinkUrl:
 *                     type: string
 *                     example: "https://example.com"
 *                   user_name:
 *                     type: string
 *                     example: "John Doe"
 *     responses:
 *       202:
 *         description: Email sending request accepted and is being processed in the background.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email sending request accepted and is being processed in the background."
 *       400:
 *         description: An invalid request was sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An invalid request was sent."
 *       404:
 *         description: Template not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Template not found."
 *       405:
 *         description: This method is not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This method is not allowed."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */

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
