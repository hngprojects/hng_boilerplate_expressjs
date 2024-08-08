/**
 * @swagger
 * /api/v1/sms/send:
 *   post:
 *     summary: Send an SMS
 *     description: Sends an SMS message to the specified phone number.
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - message
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "+23465544466"
 *                 description: The phone number to send the SMS to.
 *               message:
 *                 type: string
 *                 example: "Hello, this is a test message."
 *                 description: The content of the SMS message.
 *     responses:
 *       200:
 *         description: SMS added to the queue successfully.
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
 *                   example: SMS added to the queue successfully.
 *       400:
 *         description: Invalid input data.
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
 *         description: Sender not found.
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
 *         description: Server error.
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
import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { User } from "../models";
import { addSmsToQueue } from "../utils/queue";
import parsePhoneNumberFromString, {
  isPossiblePhoneNumber,
  PhoneNumber,
} from "libphonenumber-js";

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

  let parsedPhone: PhoneNumber;
  try {
    parsedPhone = parsePhoneNumberFromString(phone_number);

    if (!parsedPhone || !parsedPhone.isValid()) {
      const defaultCountryCode = "NG";
      parsedPhone = parsePhoneNumberFromString(
        phone_number,
        defaultCountryCode,
      );
    }
  } catch (error) {
    res.status(422).json({
      errors: [
        {
          field: "phone",
          message: "Phone must be a valid international or local number",
        },
      ],
    });
    return;
  }

  if (
    !parsedPhone ||
    !parsedPhone.isValid() ||
    !isPossiblePhoneNumber(parsedPhone.number) ||
    parsedPhone.number.length < 8 ||
    parsedPhone.number.length > 15
  ) {
    res.status(422).json({
      errors: [
        {
          field: "phone",
          message: "Phone must be a valid international or local number",
        },
      ],
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

    await addSmsToQueue({
      sender_id,
      message,
      phone_number: parsedPhone.number,
    });
    res.status(200).json({
      status: "success",
      status_code: 200,
      message: "SMS added to the queue successfully.",
    });
  } catch (error) {
    console.error("Error adding SMS to queue:", error);
    res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: "Failed to send SMS. Please try again later.",
    });
  }
};
