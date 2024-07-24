// import { Request, Response } from "express";
// import SmsService from "../services/sms.services";
// import AppDataSource from "../data-source";
// import { User } from "../models";

// export const sendSms = async (req: Request, res: Response): Promise<void> => {
//   const { phone_number, message } = req.body;
//   const sender_id = req.user.id;

//   if (!phone_number || !message || !sender_id) {
//     res.status(400).json({
//       status: "unsuccessful",
//       status_code: 400,
//       message:
//         "Valid phone number, message content, and sender ID must be provided.",
//     });
//     return;
//   }

//   try {
//     const userRepository = AppDataSource.getRepository(User);
//     const sender = await userRepository.findOneBy({ id: sender_id });

//     if (!sender) {
//       res.status(404).json({
//         status: "unsuccessful",
//         status_code: 404,
//         message: "Sender not found.",
//       });
//       return;
//     }

//     await SmsService.sendSms(sender, phone_number, message);
//     res.status(200).json({
//       status: "success",
//       status_code: 200,
//       message: "SMS sent successfully.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "unsuccessful",
//       status_code: 500,
//       message: "Failed to send SMS. Please try again later.",
//     });
//   }
// };
