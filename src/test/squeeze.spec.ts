import { NextFunction, Request, Response } from "express";
import { SqueezeController } from "../controllers/SqueezeController";
import { SqueezeService } from "../services";
import { Conflict, ResourceNotFound, BadRequest } from "../middleware";

jest.mock("../services", () => ({
  SqueezeService: {
    createSqueeze: jest.fn(),
    updateSqueeze: jest.fn(),
  },
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

      await SqueezeController.createSqueeze(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(SqueezeService.createSqueeze).toHaveBeenCalledWith(squeezeData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        status_code: 201,
        message: "Squeeze created successfully",
        data: squeeze,
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

        await SqueezeController.updateSqueeze(
          req as Request,
          res as Response,
          next as NextFunction,
        );

        expect(SqueezeService.updateSqueeze).toHaveBeenCalledWith(
          email,
          updateData,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: 200,
          status_code: 200,
          message: "Squeeze updated successfully",
          data: squeeze,
        });
      });
    });
  });
});
