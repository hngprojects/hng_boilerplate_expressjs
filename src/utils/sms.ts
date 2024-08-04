import Twilio from "twilio";
import config from "../config";

const twilioClient = Twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);

const sendSms = async (phoneNumber: string, message: string): Promise<void> => {
  await twilioClient.messages.create({
    body: message,
    from: config.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};

export default sendSms;
