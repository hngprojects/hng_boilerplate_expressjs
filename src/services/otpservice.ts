import { Repository } from "typeorm";
import { Otp, User } from "../models";
import { generateNumericOTP } from "../utils";
import { ResourceNotFound } from "../middleware";

export class OtpService {
  constructor(
    private otpRepository: Repository<Otp>,
    private userRepository: Repository<User>,
  ) {}

  async createOtp(user_id: string): Promise<Otp | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new ResourceNotFound("User not found");
      }

      const token = generateNumericOTP(6);
      const otp_expires = new Date(Date.now() + 15 * 60 * 1000);

      const otp = this.otpRepository.create({
        token,
        expiry: otp_expires,
        user,
      });

      await this.otpRepository.save(otp);
      return otp;
    } catch (error) {
      return;
    }
  }
}
