import { Request, Response } from "express";
import SmsService from "../services/sms.services";
import AppDataSource from "../data-source";
import { User } from "../models";

export const sendSms = async (req: Request, res: Response): Promise<void> => {
  const { phone_number, message } = req.body;
  const sender_id = req.user.id;

  try {
    //This statement checks if a phone number verified, message content and send ID is provided, and if not throw an error with status code 400
    if (!phone_number || !message || !sender_id) {
      res.status(400).json({
        status: "Unsuccessful",
        status_code: 400,
        message:
          "Valid phone number, message content, and sender ID must be provided.",
      });
      return;
    }

    //Checks if the sender id exist in the database. This implies that the send must be a registered user.
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

    //After all coditions above are met, a success response is returned.
    await SmsService.sendSms(sender, phone_number, message);
    res.status(200).json({
      status: "success",
      status_code: 200,
      message: "SMS sent successfully.",
    });
  } catch (error) {
    //An error response is returned here if something went wrong with the Twilio API server or there is a bad network!
    res.status(500).json({
      status: "unsuccessful",
      status_code: 500,
      message: "Failed to send SMS. Please try again later.",
    });
  }
};
