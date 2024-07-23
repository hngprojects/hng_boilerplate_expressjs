// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers";
import { UserService } from "../services";
import { validate as validateUUID, v4 as uuidv4 } from "uuid";

jest.mock("../services");
jest.mock("uuid", () => ({
  ...jest.requireActual("uuid"),
  validate: jest.fn(),
}));
jest.mock("../models");
jest.mock("jsonwebtoken");

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
    (validateUUID as jest.Mock).mockReturnValue(false);

    await UserController.getProfile(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 400,
      error: "400 Bad Request! Invalid User Id Format",
    });
  });

  it("should return 404 if user is not found", async () => {
    (validateUUID as jest.Mock).mockReturnValue(true);
    (UserService.getUserById as jest.Mock).mockResolvedValue(null);

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
      name: "Samixx Yasuke",
      email: "samixx@gmail.com",
      role: "user",
      profile: {
        id: "2d184000-50a6-4479-a25e-f007e91ce1f8",
        first_name: "Samixx",
        last_name: "Yasuke",
        phone: "1234567890",
        avatarUrl: "http://example.com/avatar.jpg",
      },
      deletedAt: new Date(),
      isDeleted: true,
    };
    (validateUUID as jest.Mock).mockReturnValue(true);
    (UserService.getUserById as jest.Mock).mockResolvedValue(user);

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
      name: "Samixx Yasuke",
      email: "samixx@example.com",
      role: "user",
      profile: {
        id: "2d184000-50a6-4479-a25e-f007e91ce1f8",
        first_name: "Samixx",
        last_name: "Yasuke",
        phone: "1234567890",
        avatarUrl: "http://example.com/avatar.jpg",
      },
      deletedAt: null,
      isDeleted: false,
    };
    (validateUUID as jest.Mock).mockReturnValue(true);
    (UserService.getUserById as jest.Mock).mockResolvedValue(user);

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
    (validateUUID as jest.Mock).mockReturnValue(true);
    (UserService.getUserById as jest.Mock).mockImplementation(() => {
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
