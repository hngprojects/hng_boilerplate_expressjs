import { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services";
import { BadRequest, ResourceNotFound } from "../middleware";

// Mock the UserService
jest.mock("../services", () => ({
  UserService: {
    getUserById: jest.fn(),
  },
}));

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should handle invalid user ID", async () => {
      // Simulate an invalid ID scenario by throwing an error
      (UserService.getUserById as jest.Mock).mockImplementation(() => {
        throw new BadRequest("Unauthorized! Invalid User Id Format");
      });

      req.user = { id: "invalid-id" } as any;

      await UserController.getProfile(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(next).toHaveBeenCalledWith(
        new BadRequest("Unauthorized! Invalid User Id Format"),
      );
    });
  });
});
