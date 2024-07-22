// src/services/passwordResetService.ts
import { AppDataSource } from "../data-source";
import { User } from "../models";
import { HttpError } from "../middleware";
import { generateResetPasswordToken, hashPassword } from "../utils";
import { Sendmail } from "../utils/mail";
import config from "../config";

export class PasswordResetService {
  public async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new HttpError(404, "User not found");
      }

      const resetToken = generateResetPasswordToken();
      const resetTokenExpires = new Date(Date.now() + 1800000); // Token expires in 30 minutes

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await AppDataSource.manager.save(user);

      const resetUrl = `${config.RESET_PASSWORD_URL}?token=${resetToken}`;

      await Sendmail({
        from: `Boilerplate <support@boilerplate.com>`,
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      return { message: "Password reset email sent" };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || "Error requesting password reset");
    }
  }

  public async resetPassword(newPassword: string, token: string): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ where: { resetPasswordToken: token } });
      if (!user || user.resetPasswordExpires < new Date()) {
        throw new HttpError(400, "Invalid or expired password reset token");
      }

      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await AppDataSource.manager.save(user);

      return { message: "Password has been reset successfully" };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || "Error resetting password");
    }
  }
}

export default PasswordResetService;
