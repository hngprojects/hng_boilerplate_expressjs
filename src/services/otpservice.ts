import { Repository } from "typeorm";
import { Otp, User } from "../models";
import { generateNumericOTP } from "../utils";
import { Expired, ResourceNotFound } from "../middleware";

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

  async findOtp(user_id: string): Promise<Otp | undefined> {
    try {
      const otp = await this.otpRepository.findOne({
        where: { user: { id: user_id } },
      });
      return otp;
    } catch (error) {
      return;
    }
  }

  async deleteOtp(user_id: string): Promise<void> {
    try {
      const otp = await this.findOtp(user_id);
      if (otp) {
        await this.otpRepository.remove(otp);
      }
    } catch (error) {
      return;
    }
  }

  async verifyOtp(user_id: string, token: string): Promise<boolean> {
    try {
      const otp = await this.otpRepository.findOne({
        where: { token, user: { id: user_id } },
      });

      if (!otp) {
        throw new ResourceNotFound("Invalid OTP");
      }

      if (otp.expiry < new Date()) {
        throw new Expired("OTP has expired");
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
