// @ts-nocheck

import jwt from "jsonwebtoken";
import AppDataSource from "../data-source";
import { Conflict, HttpError, ResourceNotFound } from "../middleware";
import { User } from "../models";
import { AuthService } from "../services";
import {} from "../services/auth.services";
import {
  comparePassword,
  generateAccessToken,
  generateNumericOTP,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils";
import { Sendmail } from "../utils/mail";

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
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone_number: "1234567890",
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
          phone_number: "1234567890",
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
      (Sendmail as jest.Mock).mockResolvedValue(mailSent);

      const result = await authService.signUp(payload);

      expect(result).toEqual({
        mailSent,
        newUser: {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          profile: {
            phone_number: "1234567890",
            first_name: "John",
            last_name: "Doe",
            avatarUrl: "",
          },
        },
        access_token: token,
      });
    });

    it("should throw a Conflict error if the user already exists", async () => {
      const payload = {
        first_name: "John",
        last_name: "Doe",
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

  describe("changePassword", () => {
    it("should change password successfully with correct old password", async () => {
      const userId = 1;
      const oldPassword = "oldPassword123";
      const newPassword = "newPassword123";
      const confirmPassword = "newPassword123";

      const user = {
        id: userId,
        password: "hashedOldPassword", // Hashed version of oldPassword
      };

      const hashedNewPassword = "hashedNewPassword";

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockResolvedValue(hashedNewPassword);
      mockManager.save.mockResolvedValue({
        ...user,
        password: hashedNewPassword,
      });

      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword,
        confirmPassword,
      );

      expect(result).toEqual({ message: "Password changed successfully" }); // Updated to match actual result
    });

    it("should throw an error if old password is incorrect", async () => {
      const userId = 1;
      const oldPassword = "wrongOldPassword";
      const newPassword = "newPassword123";
      const confirmPassword = "newPassword123";

      const user = {
        id: userId,
        password: "hashedOldPassword",
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword(
          userId,
          oldPassword,
          newPassword,
          confirmPassword,
        ),
      ).rejects.toThrow(HttpError);
    });

    it("should throw an error if new password and confirm password do not match", async () => {
      const userId = 1;
      const oldPassword = "oldPassword123";
      const newPassword = "newPassword123";
      const confirmPassword = "differentPassword123";

      const user = {
        id: userId,
        password: "hashedOldPassword",
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.changePassword(
          userId,
          oldPassword,
          newPassword,
          confirmPassword,
        ),
      ).rejects.toThrow(HttpError);
    });
  });

  describe("passwordless login with magic link", () => {
    it("should throw ResourceNotFound for non-existent user", async () => {
      const payload = {
        email: "nonexistent@example.com",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.generateMagicLink(payload.email),
      ).rejects.toThrow(ResourceNotFound);

      await expect(
        authService.generateMagicLink(payload.email),
      ).rejects.toThrow("User is not registered");

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: payload.email },
      });
    });

    it("should generate magic link for existing user", async () => {
      const payload = {
        email: "existing@example.com",
      };

      const mockUser = { id: "1", email: payload.email };
      const token = "a-authtoken";
      const mailSent = "Email sent successfully.";

      // Mock successful responses
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue(token);
      (Sendmail as jest.Mock).mockResolvedValue(mailSent);

      const result = await authService.generateMagicLink(payload.email);

      expect(result).toEqual({
        ok: true,
        message: "Email sent successfully.",
        user: mockUser,
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: payload.email },
      });
      expect(generateToken).toHaveBeenCalledWith({ email: payload.email });
      expect(Sendmail).toHaveBeenCalled();
    });

    it("should validate the token and return user information", async () => {
      const token = "valid-token";
      const email = "test@example.com";
      const mockUser = { id: "1", email };

      (verifyToken as jest.Mock).mockReturnValue({ email });
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateMagicLinkToken(token);

      expect(result).toEqual({
        status: "ok",
        email: mockUser.email,
        userId: mockUser.id,
      });
    });

    it("should throw an error for invalid token", async () => {
      const token = "invalid-token";
      (verifyToken as jest.Mock).mockReturnValue({});

      await expect(authService.validateMagicLinkToken(token)).rejects.toThrow(
        "Invalid JWT",
      );
    });

    it("should generate an access token for a valid user ID", async () => {
      const userId = "1";
      const mockAccessToken = "mock-access-token";

      (generateAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);

      const result = await authService.passwordlessLogin(userId);

      expect(result).toEqual({ access_token: mockAccessToken });
    });
  });
});

// describe('GoogleAuthService', () => {
//   let googleAuthService: GoogleAuthService;

//   beforeEach(() => {
//     googleAuthService = new GoogleAuthService();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should register a new user if authUser is null', async () => {
//     const payload = {
//       email: 'user@example.com',
//       email_verified: true,
//       name: 'John Doe',
//       picture: 'https://example.com/avatar.jpg',
//       sub: '1234567890',
//     };

//     // Mock the save function to simulate database saving
//     const saveMock = jest.fn().mockResolvedValue({ ...new User(), id: '1', profile: new UserProfile() });
//     AppDataSource.manager.save = saveMock;

//     // Mock jwt.sign to return a dummy token
//     const jwtSignMock = jest.spyOn(jwt, 'sign').mockReturnValue('dummy_token');

//     const result = await googleAuthService.handleGoogleAuthUser(payload, null);

//     expect(result).toHaveProperty('access_token', 'dummy_token');
//     expect(result.user).toHaveProperty('email', payload.email);
//     expect(saveMock).toHaveBeenCalled();
//     expect(jwtSignMock).toHaveBeenCalledWith(
//       { userId: '1' }, // Assume '1' is the user ID returned from the mock save
//       config.TOKEN_SECRET,
//       { expiresIn: '1d' },
//     );
//   });

//   it('should use existing user if authUser is provided', async () => {
//     // Mock payload data
//     const payload = {
//       email: 'user@example.com',
//       email_verified: true,
//       name: 'John Doe',
//       picture: 'https://example.com/avatar.jpg',
//       sub: '1234567890',
//     };

//     const authUser = new User();
//     authUser.email = payload.email;
//     authUser.profile = new UserProfile();

//     // Mock jwt.sign to return a dummy token
//     const jwtSignMock = jest.spyOn(jwt, 'sign').mockReturnValue('dummy_token');

//     const result = await googleAuthService.handleGoogleAuthUser(payload, authUser);

//     expect(result).toHaveProperty('access_token', 'dummy_token');
//     expect(result.user).toHaveProperty('email', payload.email);
//     expect(jwtSignMock).toHaveBeenCalledWith(
//       { userId: authUser.id },
//       config.TOKEN_SECRET,
//       { expiresIn: '1d' },
//     );
//   });

//   it('should throw BadRequest error if email does not match', async () => {
//     // Mock payload data
//     const payload = {
//       email: 'user@example.com',
//       email_verified: true,
//       name: 'John Doe',
//       picture: 'https://example.com/avatar.jpg',
//       sub: '1234567890',
//     };

//     const authUser = new User();
//     authUser.email = 'different@example.com';
//     authUser.profile = new UserProfile();

//     await expect(googleAuthService.handleGoogleAuthUser(payload, authUser)).rejects.toThrow(BadRequest);
//   });
// });
