// @ts-nocheck

import AppDataSource from "../data-source";
import { User } from "../models";
import { hashPassword, generateNumericOTP, comparePassword } from "../utils";
import { Sendmail } from "../utils/mail";
import jwt from "jsonwebtoken";
import { Conflict, HttpError } from "../middleware";
import { AuthService } from "../services";
import UserController from "../controllers/UserController";
import { UserService } from "../services/user.services";
import { NextFunction } from "express";
import { UserRole } from "../enums/userRoles";

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

// Mock UserService for deleteUser functionality
jest.mock("../services/user.services", () => ({
  UserService: jest.fn().mockImplementation(() => ({
    deleteUserById: jest.fn().mockResolvedValue(undefined), // Mock successful deletion
  })),
}));

// Mock authMiddleware and checkPermissions if not already mocked
jest.mock("../middleware/auth", () => ({
  authMiddleware: jest.fn((req: Request, res: Response, next: NextFunction) => {
    // Simulate unauthorized access by ending the request-response cycle without calling next()
    return (req: Request, res: Response, next: NextFunction) => {
      res.status(401).json({ status: 401, message: "Unauthorized" }).end();
    };
  }),
}));

jest.mock("../middleware/checkUserRole", () => ({
  checkPermissions: jest.fn((roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    // Simulate permission check failure by ending the request-response cycle without calling next()
    return (req: Request, res: Response, next: NextFunction) => {
      res.status(403).json({ status: 403, message: "Forbidden" }).end();
    };
  }),
}));

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
      (Sendmail as jest.Mock).mockResolvedValue(mailSent);

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
        HttpError
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

  describe("UserController - deleteUser", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {
        params: {
          id: "testUserId",
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(), // Chainable mock
      };
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });

    it("should delete a user successfully", async () => {
      const userController = new UserController();
      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "User deleted successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      (UserService as jest.Mock).mockImplementationOnce(() => {
        return {
          deleteUserById: jest.fn().mockRejectedValue(new Error("User not found")),
        };
      });
        
      const userController = new UserController();
      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 404,
        message: "User not found",
      });
    });

    it("should handle internal server errors", async () => {
      (UserService as jest.Mock).mockImplementationOnce(() => {
        return {
          deleteUserById: jest.fn().mockRejectedValue(new Error("Database error")),
        };
      });
        
      const userController = new UserController();
      await userController.deleteUser(req as Request, res as Response);
        
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: "Internal server error",
      });
    });

    // it("should reject requests from unauthenticated users", async () => {
    //   const userController = new UserController();
    //   req.user = { role: UserRole.USERS }; // Assuming a user object is attached by authMiddleware
    //   await expect(userController.deleteUser(req as Request, res as Response));

    //   expect(res.status).toHaveBeenCalledWith(401);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: 401,
    //     message: "Unauthorized",
    //   });
    // });

    // // Simulate lack of SUPER_ADMIN role
    // it("should reject requests from users lacking SUPER_ADMIN role", async () => {
    //   const userController = new UserController();
    //   req.user = { role: UserRole.USER }; // Assume middleware sets this; simulate lack of SUPER_ADMIN role
    //   await expect(res.status).toHaveBeenCalledWith(403);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: 403,
    //     message: "Forbidden",
    //   });
    // });
  });
});