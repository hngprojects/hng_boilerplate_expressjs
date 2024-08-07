import { NextFunction, Request, Response } from "express";
import { SqueezeController } from "../controllers/SqueezeController";
import { SqueezeService } from "../services";
import { sendJsonResponse } from "../helpers/responsehelper";

jest.mock("../services");
jest.mock("../helpers/responsehelper", () => ({
  sendJsonResponse: jest.fn(),
}));

describe("SqueezeController", () => {
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

  describe("createSqueeze", () => {
    it("should successfully create a squeeze", async () => {
      const squeezeData = {
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      };
      const squeeze = { id: "123", ...squeezeData };

      (SqueezeService.createSqueeze as jest.Mock).mockResolvedValue(squeeze);

      req.body = squeezeData;

      const squeezeController = new SqueezeController();

      await squeezeController.createSqueeze(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(SqueezeService.createSqueeze).toHaveBeenCalledWith(squeezeData);
      expect(sendJsonResponse).toHaveBeenCalledWith(
        res,
        201,
        "Squeeze record created successfully.",
        squeeze,
      );
    });
  });

  describe("updateSqueeze", () => {
    it("should successfully update a squeeze", async () => {
      const email = "test@example.com";
      const updateData = { phone: "1234567890" };
      const squeeze = { email, ...updateData };

      (SqueezeService.updateSqueeze as jest.Mock).mockResolvedValue(squeeze);

      req.params = { email };
      req.body = updateData;

      const squeezeController = new SqueezeController();

      await squeezeController.updateSqueeze(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(SqueezeService.updateSqueeze).toHaveBeenCalledWith(
        email,
        updateData,
      );
      expect(sendJsonResponse).toHaveBeenCalledWith(
        res,
        200,
        "Your record has been successfully updated. You cannot update it again.",
        squeeze,
      );
    });
  });
});
