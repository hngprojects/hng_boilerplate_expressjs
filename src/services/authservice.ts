import { Repository } from "typeorm";
import { OtpService } from ".";
import config from "../config";
import APP_CONFIG from "../config/app.config";
import AppDataSource from "../data-source";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { Otp, Profile, User } from "../models";
import {
  GoogleVerificationPayloadInterface,
  IAuthService,
  IUserLogin,
  IUserSignUp,
  UserType,
} from "../types";

import {
  comparePassword,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils";
import { Sendmail } from "../utils/mail";
import { addEmailToQueue } from "../utils/queue";
import { userLoginResponseDto } from "../utils/response-handler";
import renderTemplate from "../views/email/renderTemplate";
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

      const access_token = await generateToken({ user_id: user.id });

      const otp = await this.otpService.createOtp(user.id);

      await Sendmail({
        from: `Boilerplate <support@boilerplate.com>`,
        to: email,
        subject: "OTP VERIFICATION",
        html: compilerOtp(parseInt(otp.token), user.first_name),
      });

      const userResponse = userLoginResponseDto(user);

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

      const access_token = await generateToken({ user_id: user.id });

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

      const access_token = await generateToken({ user_id: user.id });

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

  public async generateMagicLink(email: string) {
    try {
      const user = await User.findOne({ where: { email } });
      if (user === null || !user) {
        throw new ResourceNotFound("User is not registered");
      }

      const token = generateToken({ email: email });
      const protocol = APP_CONFIG.USE_HTTPS ? "https" : "http";
      const magicLinkUrl = `${protocol}://${config.BASE_URL}/auth/magic-link?token=${token}`;

      const emailTemplate = renderTemplate("magic-link", {
        title: "MAGIC LINK LOGIN",
        email: email,
        magicLinkUrl,
        expirationTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toLocaleString(),
      });

      const emailContent = {
        from: `Boilerplate <${config.SMTP_USER}>`,
        to: email,
        subject: "Magic Link Login",
        html: emailTemplate,
      };

      const emailResponse = await addEmailToQueue(emailContent);

      return {
        ok: emailResponse === "Email sent.",
        message: "Sign-in token sent to email.",
        user,
      };
    } catch (err) {
      throw err;
    }
  }

  public async validateMagicLinkToken(token: string) {
    try {
      const { email } = verifyToken(token as string);
      if (!email) {
        throw new BadRequest("Invalid JWT");
      }

      const user = await User.findOne({
        where: { email: String(email) },
      });

      if (user === null || !user) {
        throw new ResourceNotFound("User not found");
      }

      return {
        status: "ok",
        email: user.email,
        userId: user.id,
      };
    } catch (error) {
      throw error;
    }
  }

  public async passwordlessLogin(userId: string) {
    try {
      const access_token = await generateToken({ user_id: userId });

      return {
        access_token,
      };
    } catch (error) {
      throw error;
    }
  }

  public async googleSignin(
    payload: Partial<GoogleVerificationPayloadInterface>,
  ): Promise<{
    userInfo: Partial<User>;
    is_new_user: boolean;
  }> {
    try {
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
    } catch (error) {
      throw error;
    }
  }
}
