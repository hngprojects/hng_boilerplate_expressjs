/// <reference types="jest" />

import { AppDataSource } from "../data-source";
import { User } from "../models";
import { PasswordResetService } from "./passwordReset.services";
import { generateResetPasswordToken, hashPassword } from "../utils";
import app from '../index'; // Import the Express app

// Mock dependencies
jest.mock("../utils/mail");
jest.mock("../utils");

// Provide a mock implementation for the Sendmail function
const { Sendmail } = require("../utils/mail");
Sendmail.mockImplementation(() => {
  console.log("Mocked Sendmail function called");
  return Promise.resolve("Email sent successfully.");
});

const mockUser = new User();
mockUser.id = "1";
mockUser.email = "test@example.com";
mockUser.password = "hashedPassword";
mockUser.resetPasswordToken = "token";
mockUser.resetPasswordExpires = new Date(Date.now() + 3600000);
mockUser.save = jest.fn();
mockUser.hasId = jest.fn();
mockUser.remove = jest.fn();
mockUser.softRemove = jest.fn();
mockUser.recover = jest.fn();
mockUser.reload = jest.fn();

describe("PasswordResetService", () => {
  let passwordResetService: PasswordResetService;

  beforeAll(async () => {
    await AppDataSource.initialize();
    passwordResetService = new PasswordResetService();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("requestPasswordReset", () => {
    it("should send a reset email if user is found", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(AppDataSource.manager, "save").mockResolvedValue(mockUser);
      (generateResetPasswordToken as jest.Mock).mockReturnValue("resetToken");

      const result = await passwordResetService.requestPasswordReset("test@example.com");

      expect(Sendmail).toHaveBeenCalled();
      expect(generateResetPasswordToken).toHaveBeenCalled();
      expect(result).toEqual({ message: "Password reset email sent" });
    });

    it("should throw an error if user is not found", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      await expect(passwordResetService.requestPasswordReset("test@example.com")).rejects.toThrow("User not found");
    });
  });

  describe("resetPassword", () => {
    it("should reset the password if token is valid", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(AppDataSource.manager, "save").mockResolvedValue(mockUser);
      (hashPassword as jest.Mock).mockResolvedValue("newHashedPassword");

      const result = await passwordResetService.resetPassword("newPassword", "token");

      expect(hashPassword).toHaveBeenCalledWith("newPassword");
      expect(mockUser.password).toBe("newHashedPassword");
      expect(result).toEqual({ message: "Password has been reset successfully" });
    });

    it("should throw an error if token is invalid or expired", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      await expect(passwordResetService.resetPassword("newPassword", "invalidToken")).rejects.toThrow("Invalid or expired password reset token");
    });
  });
});
