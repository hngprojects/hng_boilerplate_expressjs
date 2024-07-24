// @ts-nocheck

import AppDataSource from "../data-source";
import { User } from "../models/index";
import jwt from "jsonwebtoken";
import { AuthService, ProductService } from "../services/index";
import { authMiddleware } from "../middleware/auth";
import { ProductController } from "../controllers/ProductController";

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {},
      initialize: jest.fn().mockResolvedValue(true),
    },
  };
});
jest.mock("../models");
jest.mock("jsonwebtoken");

describe("Single product", () => {
  let mockManager;

  let prodService: ProductService;
  let prodController: ProductController;

  beforeEach(() => {
    prodService = new ProductService();
    prodController = new ProductController();

    mockManager = {
      findOne: jest.fn(),
    };

    AppDataSource.manager = mockManager;
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockManager);
  });

  it("check if user is authenticated", async () => {
    const req = {
      headers: {
        authorization: "Bearer validToken",
      },
      user: undefined,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
      callback(null, { userId: "user123" });
    });

    User.findOne = jest.fn().mockResolvedValue({
      id: "donalTrump123",
      email: "americaPresident@newyork.com",
    });

    await authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe("donalTrump123");
    expect(next).toHaveBeenCalled();
  });

  it("should get a single user org", async () => {
    const product_id = "49609fa8-1a41-433a-8cf0-e79491ee9af8";
    const userId = "donalTrump123";
    const response = {
      id: "1",
      name: "Product 1",
      description: "Description for product 1",
      price: 1099,
      category: "Category 1",
    };

    mockManager.findOne.mockResolvedValue(response);

    const result = await prodService.getProduct(product_id);

    expect(mockManager.findOne).toHaveBeenCalledWith({
      where: { id: product_id },
    });
    expect(mockManager.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(response);
  });

  it("should return 400 if product ID isnt valid(automatically flags a non-uuid ID)", async () => {
    const product_id = "thankmelater555";

    mockManager.findOne.mockResolvedValue(null);

    const req = {
      params: { id: product_id },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await prodController.fetchProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "Unsuccessful",
      message: "Invalid product ID",
      status_code: 400,
    });
  });

  it("should return 400 if product ID is empty", async () => {
    const product_id = "";

    mockManager.findOne.mockResolvedValue(null);

    const req = {
      params: {
        product_id,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await prodController.fetchProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "Unsuccessful",
      message: "Invalid product ID",
      status_code: 400,
    });
  });

  it("should return 404 if product does not exist", async () => {
    const product_id = "49609fa8-1a41-433a-8cf0-e79491ee9af1";

    mockManager.findOne.mockResolvedValue(null);

    const req = {
      params: {
        product_id,
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await prodController.fetchProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "Unsuccessful",
      message: "Product does not exist",
      status_code: 404,
    });
  });
});
