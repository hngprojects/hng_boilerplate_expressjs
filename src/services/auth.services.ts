import AppDataSource from "../data-source";
import { Profile, User } from "../models";
import { IAuthService, IUserSignUp, IUserLogin } from "../types";
import { Conflict, HttpError } from "../middleware";
import { hashPassword, generateNumericOTP, comparePassword } from "../utils";
import { Sendmail } from "../utils/mail";
import jwt from "jsonwebtoken";
import { compilerOtp } from "../views/welcome";
import config from "../config";
import generateResetToken from "../utils/generate-reset-token";
import { PasswordResetToken } from "../models/password-reset-token";
import nodemailer from "nodemailer";

export class AuthService implements IAuthService {
  public async signUp(payload: IUserSignUp): Promise<{
    mailSent: string;
    newUser: Partial<User>;
    access_token: string;
  }> {
    const { firstName, lastName, email, password, phone } = payload;

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
      user.name = `${firstName} ${lastName}`;
      user.email = email;
      user.password = hashedPassword;
      user.profile = new Profile();
      user.profile.phone = phone;
      user.profile.first_name = firstName;
      user.profile.last_name = lastName;
      user.profile.avatarUrl = "";
      user.otp = parseInt(otp);
      user.otp_expires_at = otpExpires;

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

      const { password: _, ...rest } = createdUser;

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
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new HttpError(404, "User not found");
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

  public async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const { resetToken, hashedToken, expiresAt } = generateResetToken();

      const passwordResetToken = new PasswordResetToken();
      passwordResetToken.token = hashedToken;
      passwordResetToken.expiresAt = expiresAt;
      passwordResetToken.user = user;

      await AppDataSource.manager.save(passwordResetToken);

      // Send email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `Boilerplate <support@boilerplate.com>`,
        to: email,
        subject: "Password Reset",
        text: `You requested for a password reset. Use this token to reset your password: ${resetToken}`,
      };

      await transporter.sendMail(mailOptions);

      return { message: "Password reset link sent successfully." };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
