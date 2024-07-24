// @ts-nocheck

import AppDataSource from "../data-source";
import { User } from "../models";
import { hashPassword, generateNumericOTP, comparePassword } from "../utils";
import { Sendemail } from "../utils/mail";
import jwt from "jsonwebtoken";
import { Conflict, HttpError } from "../middleware";
import { AuthService } from "../services";

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {},
      initialize: jest.fn().mockResolvedValue(true),
    },
  };
});
jest.mock("../models");
jest.mock("../utils");
jest.mock("../utils/mail");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let mockManager;

  beforeEach(() => {
    authService = new AuthService();

    mockManager = {
      save: jest.fn(),
    };

    // Assign the mock manager to the AppDataSource.manager
    AppDataSource.manager = mockManager;
  });

  describe("signUp", () => {
    it("should sign up a new user", async () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      };

      const hashedPassword = "hashedPassword";
      const otp = "123456";
      const mailSent = "mailSent";
      const createdUser = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        profile: {
          phone: "1234567890",
          first_name: "John",
          last_name: "Doe",
          avatarUrl: "",
        },
        otp: parseInt(otp),
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
      };
      const token = "access_token";

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (generateNumericOTP as jest.Mock).mockReturnValue(otp);
      mockManager.save.mockResolvedValue(createdUser);
      (jwt.sign as jest.Mock).mockReturnValue(token);
      (Sendemail as jest.Mock).mockResolvedValue(mailSent);

      const result = await authService.signUp(payload);

      expect(result).toEqual({
        mailSent,
        newUser: {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          profile: {
            phone: "1234567890",
            first_name: "John",
            last_name: "Doe",
            avatarUrl: "",
          },
          otp: parseInt(otp),
          otp_expires_at: expect.any(Date),
        },
        access_token: token,
      });
    });

    it("should throw a Conflict error if the user already exists", async () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      };

      (User.findOne as jest.Mock).mockResolvedValue({});

      await expect(authService.signUp(payload)).rejects.toThrow(Conflict);
    });
  });

  describe("verifyEmail", () => {
    it("should verify email with correct OTP", async () => {
      const token = "validToken";
      const otp = 123456;
      const user = {
        id: 1,
        email: "john.doe@example.com",
        otp,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
        isverified: false,
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
      (User.findOne as jest.Mock).mockResolvedValue(user);
      mockManager.save.mockResolvedValue(user);

      const result = await authService.verifyEmail(token, otp);

      expect(result).toEqual({ message: "Email successfully verified" });
    });

    it("should throw an error for invalid OTP", async () => {
      const token = "validToken";
      const otp = 123456;
      const user = {
        id: 1,
        email: "john.doe@example.com",
        otp: 654321,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
        isverified: false,
      };

      (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });
      (User.findOne as jest.Mock).mockResolvedValue(user);

      await expect(authService.verifyEmail(token, otp)).rejects.toThrow(
        HttpError,
      );
    });
  });

  describe("login", () => {
    it("should login user with correct credentials", async () => {
      const payload = {
        email: "john.doe@example.com",
        password: "password123",
      };

      const user = {
        id: 1,
        email: "john.doe@example.com",
        password: "hashedPassword",
        isverified: true,
      };

      const token = "access_token";

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.login(payload);

      expect(result).toEqual({
        access_token: token,
        user: {
          id: 1,
          email: "john.doe@example.com",
          isverified: true,
        },
      });
    });

    it("should throw an error for incorrect credentials", async () => {
      const payload = {
        email: "john.doe@example.com",
        password: "wrongPassword",
      };

      const user = {
        id: 1,
        email: "john.doe@example.com",
        password: "hashedPassword",
        isverified: true,
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(payload)).rejects.toThrow(HttpError);
    });
  });
});
