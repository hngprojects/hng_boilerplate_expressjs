

/**
 * @swagger
 * /api/v1/sms:
 *   post:
 *     tags:
 *       - SMS
 *     summary: Send an SMS
 *     description: Sends an SMS to a specified phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *               message:
 *                 type: string
 *                 example: "Hello, this is a test message."
 *             required:
 *               - phone_number
 *               - message
 *     responses:
 *       200:
 *         description: SMS sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: SMS sent successfully.
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Valid phone number, message content, and sender ID must be provided.
 *       404:
 *         description: Sender not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Sender not found.
 *       500:
 *         description: Failed to send SMS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to send SMS. Please try again later.
 */

/**
 * @swagger
 * /api/v1/emailTemplates:
 *   get:
 *     tags:
 *       - emailTemplates
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
 *   post:
 *     tags:
 *       - Emailtemplates
 *     summary: Create a new email template
 *     description: Create a new email template with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Welcome Email"
 *               details:
 *                 type: string
 *                 example: "Hello, welcome to our service!"
 *             required:
 *               - title
 *               - details
 *     responses:
 *       201:
 *         description: The email template was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplates'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unsuccessful"
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Title and details are required."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailTemplates:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         details:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         user_id:
 *           type: integer
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
