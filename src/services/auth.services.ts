import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import AppDataSource from "../data-source";
import { Conflict, HttpError } from "../middleware";
import { Profile, User } from "../models";
import { PasswordResetToken } from "../models/password-reset-token";
import { IAuthService, IUserLogin, IUserSignUp } from "../types";
import { comparePassword, generateNumericOTP, hashPassword } from "../utils";
import generateResetToken from "../utils/generate-reset-token";
import { Sendmail } from "../utils/mail";
import { compilerOtp } from "../views/welcome";

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
      const emailContent = {
        from: `Boilerplate <${config.SMTP_USER}>`,
        to: email,
        subject: "Password Reset",
        text: `You requested for a password reset. Use this token to reset your password: ${resetToken}`,
      };

      await Sendmail(emailContent);

      return { message: "Password reset link sent successfully." };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const passwordResetTokenRepository =
        AppDataSource.getRepository(PasswordResetToken);
      const passwordResetToken = await passwordResetTokenRepository.findOne({
        where: { token },
        relations: ["user"],
      });

      if (!passwordResetToken) {
        throw new HttpError(404, "Invalid or expired token");
      }

      if (passwordResetToken.expiresAt < new Date()) {
        throw new HttpError(400, "Token expired");
      }

      const user = passwordResetToken.user;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await AppDataSource.manager.save(user);
      await passwordResetTokenRepository.remove(passwordResetToken);

      return { message: "Password reset successfully." };
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

      if (newPassword !== confirmPassword) {
        throw new HttpError(400, "New password and confirmation do not match");
      }

      user.password = await hashPassword(newPassword);
      await AppDataSource.manager.save(user);

      return { message: "Password changed successfully" };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
