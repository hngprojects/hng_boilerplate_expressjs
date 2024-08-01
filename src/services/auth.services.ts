// auth service
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { MoreThan } from "typeorm";
import config from "../config";
import APP_CONFIG from "../config/app.config";
import AppDataSource from "../data-source";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { Profile, User } from "../models";
import { IAuthService, IUserLogin, IUserSignUp } from "../types";
import {
  comparePassword,
  generateAccessToken,
  generateNumericOTP,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils";
import { Sendmail } from "../utils/mail";
import { addEmailToQueue } from "../utils/queue";
import renderTemplate from "../views/email/renderTemplate";
import { generateMagicLinkEmail } from "../views/magic-link.email";
import { compilerOtp } from "../views/welcome";

export class AuthService implements IAuthService {
  public async signUp(payload: IUserSignUp): Promise<{
    mailSent: string;
    newUser: Partial<User>;
    access_token: string;
  }> {
    const { first_name, last_name, email, password } = payload;

    try {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        throw new Conflict("User already exists");
      }
      const hashedPassword = await hashPassword(password);
      const otp = generateNumericOTP(6);
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      const user = new User();
      user.name = `${first_name} ${last_name}`;
      user.email = email;
      user.password = hashedPassword;
      user.profile = new Profile();
      user.profile.first_name = first_name;
      user.profile.last_name = last_name;
      user.profile.avatarUrl = "";
      user.otp = parseInt(otp);
      user.otp_expires_at = otpExpires;
      user.isverified = true;

      const createdUser = await AppDataSource.manager.save(user);
      const access_token = jwt.sign(
        { userId: createdUser.id },
        config.TOKEN_SECRET,
        {
          expiresIn: "1d",
        },
      );

      const mailSent = await Sendmail({
        from: `Boilerplate <support@boilerplate.com>`,
        to: email,
        subject: "OTP VERIFICATION",
        html: compilerOtp(parseInt(otp), user.name),
      });

      const {
        password: _,
        otp: __,
        otp_expires_at: ___,
        ...rest
      } = createdUser;

      return { mailSent, newUser: rest, access_token };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async verifyEmail(
    token: string,
    otp: number,
  ): Promise<{ message: string }> {
    try {
      const decoded: any = jwt.verify(token, config.TOKEN_SECRET);
      const userId = decoded.userId;

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpError(404, "User not found");
      }

      if (user.otp !== otp || user.otp_expires_at < new Date()) {
        throw new HttpError(400, "Invalid OTP ");
      }

      user.isverified = true;
      await AppDataSource.manager.save(user);

      return { message: "Email successfully verified" };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new HttpError(400, "Verification token has expired");
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async login(
    payload: IUserLogin,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const { email, password } = payload;

    try {
      const user = await User.findOne({
        where: { email },
        relations: ["profile"],
      });

      if (!user) {
        throw new HttpError(404, "User not found");
      }

      if (user.google_id && user.password === null) {
        throw new HttpError(401, "User Created with Google");
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new HttpError(401, "Invalid credentials");
      }

      if (!user.isverified) {
        throw new HttpError(403, "Email not verified");
      }

      const access_token = jwt.sign({ userId: user.id }, config.TOKEN_SECRET, {
        expiresIn: "1d",
      });

      const { password: _, ...userWithoutPassword } = user;

      return { access_token, user: userWithoutPassword };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  resetPassword = async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const user = await User.findOne({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: MoreThan(Date.now()),
        },
      });

      if (!user) {
        throw new HttpError(404, "Token is invalid or has expired");
      }

      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await AppDataSource.manager.save(user);

      return { message: "Password reset successfully." };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  };

  public async forgotPassword(
    email: string,
    resetURL: string,
  ): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const resetToken = user.createPasswordResetToken();
      await AppDataSource.manager.save(user);

      const htmlTemplate = renderTemplate("password-reset", {
        title: "Reset Password",
        userName: user.name,
        resetUrl: resetURL + `${resetToken}`,
      });

      const emailContent = {
        from: `Boilerplate <${config.SMTP_USER}>`,
        to: email,
        subject: "Password Reset",
        html: htmlTemplate,
      };

      await addEmailToQueue(emailContent);

      return { message: "Password reset link sent successfully." };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const isOldPasswordValid = await comparePassword(
        oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new HttpError(401, "Old password is incorrect");
      }

      if (oldPassword === newPassword) {
        throw new HttpError(
          400,
          "You used this password recently. Please choose a different one.",
        );
      }

      if (newPassword !== confirmPassword) {
        throw new HttpError(400, "New password and confirmation do not match");
      }

      user.password = await hashPassword(newPassword);
      await AppDataSource.manager.save(user);

      return { message: "Password changed successfully" };
    } catch (error) {
      throw error;
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
      const magicLinkUrl = `${protocol}://${config.BASE_URL}/api/v1/auth/magic-link?token=${token}`;

      const mailToBeSentToUser = await Sendmail({
        from: `Boilerplate <support@boilerplate.com>`,
        to: email,
        subject: "MAGIC LINK LOGIN",
        html: generateMagicLinkEmail(magicLinkUrl, email),
      });

      return {
        ok: mailToBeSentToUser === "Email sent successfully.",
        message: "Email sent successfully.",
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
      const access_token = await generateAccessToken(userId);

      return {
        access_token,
      };
    } catch (error) {
      throw error;
    }
  }
}
