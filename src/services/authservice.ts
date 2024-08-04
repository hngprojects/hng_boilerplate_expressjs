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
import {
  GoogleVerificationPayloadInterface,
  IAuthService,
  IUserLogin,
  IUserSignUp,
  UserType,
} from "../types";
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

  public async login(payload: IUserLogin): Promise<{
    message: string;
    user: Partial<User>;
    access_token: string;
  }> {
    const { email, password } = payload;

    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new ResourceNotFound("User not found");
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequest("Invalid email or password");
      }

      const access_token = await generateAccessToken(user.id);

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
        message: "Login successful",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async googleSignin(
    payload: Partial<GoogleVerificationPayloadInterface>,
  ): Promise<{
    userInfo: Partial<User>;
    is_new_user: boolean;
  }> {
    const {
      sub: google_id,
      email,
      given_name,
      family_name,
      picture,
      email_verified,
    } = payload;

    let authUser: User;
    let is_new_user = false;

    let user = await AppDataSource.getRepository(User).findOne({
      where: { email },
      relations: ["profile"],
    });

    if (!user) {
      is_new_user = true;
      authUser = new User();
      authUser.google_id = google_id;
      authUser.email = email;
      authUser.password = "";
      authUser.first_name = given_name;
      authUser.last_name = family_name;
      authUser.is_verified = email_verified;

      const profile = await this.profilesRepository.save({
        email,
        username: "",
        profile_pic_url: picture,
      });

      authUser.profile = profile;
    } else {
      authUser = user;
    }
    await this.usersRepository.save(authUser);
    const userInfo = {
      id: authUser.id,
      email: email,
      first_name: authUser.first_name,
      last_name: authUser.last_name,
      fullname: authUser.first_name + " " + authUser.last_name,
      role: "",
    };
    return { userInfo, is_new_user };
  }
}
