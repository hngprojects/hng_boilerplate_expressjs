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
import SmsService from "../services/sms.services";
import AppDataSource from "../data-source";
import { User } from "../models";

export const sendSms = async (req: Request, res: Response): Promise<void> => {
  const { phone_number, message } = req.body;
  const sender_id = req.user.id;

  if (!phone_number || !message || !sender_id) {
    res.status(400).json({
      status: "unsuccessful",
      status_code: 400,
      message:
        "Valid phone number, message content, and sender ID must be provided.",
    });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const sender = await userRepository.findOneBy({ id: sender_id });

    if (!sender) {
      res.status(404).json({
        status: "unsuccessful",
        status_code: 404,
        message: "Sender not found.",
      });
      return;
    }

    await SmsService.sendSms(sender, phone_number, message);
    res.status(200).json({
      status: "success",
      status_code: 200,
      message: "SMS sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: "Failed to send SMS. Please try again later.",
    });
  }
};
