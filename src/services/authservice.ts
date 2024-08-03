import { Repository } from "typeorm";
import jwt from "jsonwebtoken";
import config from "../config";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { User, Profile, Otp } from "../models";
import { IAuthService, IUserSignUp, UserType } from "../types";
import {
  comparePassword,
  generateAccessToken,
  generateNumericOTP,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils";
import AppDataSource from "../data-source";
import { OtpService } from ".";
import { Sendmail } from "../utils/mail";
import { compilerOtp } from "../views/welcome";

export class AuthService implements IAuthService {
  private usersRepository: Repository<User>;
  private profilesRepository: Repository<Profile>;
  private otpService: OtpService;

  constructor() {
    this.usersRepository = AppDataSource.getRepository(User);
    this.profilesRepository = AppDataSource.getRepository(Profile);
    this.otpService = new OtpService(
      AppDataSource.getRepository(Otp),
      this.usersRepository,
    );
  }

  public async signUp(payload: IUserSignUp): Promise<{
    message: string;
    user: Partial<User>;
    access_token: string;
  }> {
    const { first_name, last_name, email, password, admin_secret } = payload;

    try {
      const userExists = await this.usersRepository.findOne({
        where: { email },
      });

      if (userExists) {
        throw new Conflict("User already exists");
      }

      const hashedPassword = await hashPassword(password);
      const user = new User();
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.password = hashedPassword;
      user.is_active = true;
      user.user_type =
        admin_secret && admin_secret === config.SUPER_SECRET_KEY
          ? UserType.SUPER_ADMIN
          : admin_secret === config.ADMIN_SECRET_KEY
            ? UserType.ADMIN
            : UserType.USER;

      const profile = await this.profilesRepository.save({
        email: email,
        username: "",
        profile_pic_url: "",
      });
      user.profile = profile;

      await this.usersRepository.save(user);

      const access_token = await generateAccessToken(user.id);

      const otp = await this.otpService.createOtp(user.id);

      await Sendmail({
        from: `Boilerplate <support@boilerplate.com>`,
        to: email,
        subject: "OTP VERIFICATION",
        html: compilerOtp(parseInt(otp.token), user.first_name),
      });

      const userResponse = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.user_type,
        avatar_url: user.profile.profile_pic_url,
        user_name: user.profile.username,
      };

      return {
        user: userResponse,
        access_token,
        message:
          "User Created Successfully. Kindly check your mail for your verification token",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async verifyEmail(
    token: string,
    email: string,
  ): Promise<{
    message: string;
    access_token: string;
  }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new ResourceNotFound("User not found");
      }
      const otp = await this.otpService.verifyOtp(user.id, token);
      if (!otp) {
        throw new BadRequest("Invalid OTP");
      }

      if (!user) {
        throw new ResourceNotFound("User not found");
      }
      user.is_verified = true;
      await this.usersRepository.save(user);

      const access_token = await generateAccessToken(user.id);

      return {
        access_token,
        message: "Email verified successfully",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
