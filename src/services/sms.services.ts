import Twilio from "twilio";
import config from "../config";
import AppDataSource from "../data-source";
import { Sms } from "../models/sms";
import { User } from "../models";

class SmsService {
  private twilioClient: Twilio.Twilio;

  constructor() {
    this.twilioClient = Twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);
  }

  public async sendSms(
    message: string,
    phone_number: string,
    sender: User,
  ): Promise<void> {
    await this.twilioClient.messages.create({
      body: message,
      from: config.TWILIO_PHONE_NUMBER,
      to: phone_number,
    });

    const sms = new Sms();
    sms.sender = sender;
    sms.phone_number = phone_number;
    sms.message = message;

    const smsRepository = AppDataSource.getRepository(Sms);
    await smsRepository.save(sms);
  }
}

export default new SmsService();
