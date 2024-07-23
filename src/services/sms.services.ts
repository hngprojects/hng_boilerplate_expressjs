import Twilio from "twilio";
import config from "../config";
import AppDataSource from "../data-source";
import { Sms } from "../models/sms";
import { User } from "../models";

class SmsService {
  private twilioClient: Twilio.Twilio;;

  constructor() {
    this.twilioClient = Twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);
  }

  public async sendSms(
    sender: User,
    phoneNumber: string,
    message: string
  ): Promise<void> {
    await this.twilioClient.messages.create({
      body: message,
      from: config.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    const sms = new Sms();
    sms.sender = sender;
    sms.phone_number = phoneNumber;
    sms.message = message;

    const smsRepository = AppDataSource.getRepository(Sms);
    await smsRepository.save(sms);
  }
}

export default new SmsService();
