import { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services";
import { sendJsonResponse } from "../helpers/responsehelper";
import { BadRequest, ResourceNotFound, Forbidden } from "../middleware";

jest.mock("../services");
jest.mock("../helpers/responsehelper", () => ({
  sendJsonResponse: jest.fn(),
}));

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "Samixx",
        last_name: "Yasuke",
        email: "samixx@example.com",
        password: "hashedpassword",
        is_active: true,
        is_verified: true,
        user_type: "vendor",
        profile: {
          id: "profile1",
          username: "samixx yasuke",
          bio: "This is samixx bio",
          jobTitle: "Developer",
          language: "English",
          pronouns: "he/him",
          department: "Software Engineering",
          social_links: [],
          timezones: "WAT",
        },
      } as any,
      params: {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProfile", () => {
    it("should return user profile details successfully", async () => {
      const mockUser = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "hashedpassword",
        is_active: true,
        is_verified: true,
        user_type: "vendor",
        profile: {
          id: "profile1",
          username: "johndoe",
          bio: "This is a bio",
          jobTitle: "Developer",
          language: "English",
          pronouns: "he/him",
          department: "Engineering",
          social_links: {},
          timezones: "UTC",
        },
        is_deleted: false,
        deletedAt: null,
      };

      (UserService.prototype.getUserById as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const userController = new UserController();

      await userController.getUserProfile(
        req as Request,
        res as Response,
        next,
      );

      const { password, ...userData } = mockUser;

      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440000",
      );
      expect(sendJsonResponse).toHaveBeenCalledWith(
        res,
        200,
        "User profile details retrieved successfully",
        userData,
      );
    });

    it("should call next with BadRequest if user ID is invalid or missing in params", async () => {
      req.params = { user_id: "" } as any;

      const userController = new UserController();

      await userController.getUserProfile(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(
        new BadRequest("Invalid or missing user ID in params!"),
      );
    });

    it("should call next with ResourceNotFound if user is not found", async () => {
      (UserService.prototype.getUserById as jest.Mock).mockResolvedValue(null);

      const userController = new UserController();

      await userController.getUserProfile(
        req as Request,
        res as Response,
        next,
      );

      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440000",
      );
      expect(next).toHaveBeenCalledWith(
        new ResourceNotFound("User not found!"),
      );
    });

    it("should call next with ResourceNotFound if user is deleted", async () => {
      const mockUser = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        is_deleted: true,
        deletedAt: new Date(),
      };

      (UserService.prototype.getUserById as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const userController = new UserController();

      await userController.getUserProfile(
        req as Request,
        res as Response,
        next,
      );

      expect(UserService.prototype.getUserById).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440000",
      );
      expect(next).toHaveBeenCalledWith(
        new ResourceNotFound("User not found!"),
      );
    });
  });
});
