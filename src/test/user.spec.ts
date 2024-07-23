// @ts-nocheck
// tests/unit/userController.test.js
import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers";
import { UserService } from "../services";
import { validate as validateUUID, v4 as uuidv4 } from "uuid";

jest.mock("../services");
jest.mock("uuid", () => ({
  ...jest.requireActual("uuid"),
  validate: jest.fn(),
}));

describe("Unit test for /api/v1/users/me", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const userId = uuidv4();
  const userEmail = `${uuidv4()}@example.com`;

  beforeEach(() => {
    req = {
      user: {
        id: "058cca9a-d00a-44a1-b49d-f7b4ac0153c0",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 400 if user ID format is invalid", async () => {
    validateUUID.mockReturnValue(false);

    await UserController.getProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 400,
      error: "400 Bad Request! Invalid User Id Format",
    });
  });

  it("should return 404 if user is not found", async () => {
    validateUUID.mockReturnValue(true);
    UserService.getUserById.mockResolvedValue(null);

    await UserController.getProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 404,
      error: "User Not Found!",
    });
  });

  it("should return 404 if user is soft deleted", async () => {
    const user = {
      id: req.user.id,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      profile: {
        id: "profile_id",
        first_name: "John",
        last_name: "Doe",
        phone: "1234567890",
        avatarUrl: "http://example.com/avatar.jpg",
      },
      deletedAt: new Date(),
      isDeleted: true,
    };
    validateUUID.mockReturnValue(true);
    UserService.getUserById.mockResolvedValue(user);

    await UserController.getProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 404,
      error: "User not found! (soft deleted user)",
    });
  });

  it("should return 200 and user profile details if user is found", async () => {
    const user = {
      id: req.user.id,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      profile: {
        id: "profile_id",
        first_name: "John",
        last_name: "Doe",
        phone: "1234567890",
        avatarUrl: "http://example.com/avatar.jpg",
      },
      deletedAt: null,
      isDeleted: false,
    };
    validateUUID.mockReturnValue(true);
    UserService.getUserById.mockResolvedValue(user);

    await UserController.getProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 200,
      message: "User profile details retrieved successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_id: user.profile.id,
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
        phone: user.profile.phone,
        avatar_url: user.profile.avatarUrl,
      },
    });
  });

  it("should return 500 if there is a server error", async () => {
    validateUUID.mockReturnValue(true);
    UserService.getUserById.mockImplementation(() => {
      throw new Error("Server error");
    });

    await UserController.getProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 500,
      error: "Internal Server Error",
    });
  });
});
