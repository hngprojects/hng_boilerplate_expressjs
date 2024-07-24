// @ts-nocheck
import { ProductService } from "../services/product.services";
import AppDataSource from "../data-source";
import { mock, MockProxy } from "jest-mock-extended";
import { User } from "../models/index";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/index";
import { authMiddleware } from "../services/index";
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

describe("Product Tests", () => {
  let productService: ProductService;
  let productRepository: MockProxy<any>;

  beforeEach(() => {
    productRepository = mock();
    AppDataSource.getRepository = jest.fn().mockReturnValue(productRepository);
    productService = new ProductService();
  });

  it("should return paginated products", async () => {
    const products = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ];
    productRepository.find.mockResolvedValue(products);
    productRepository.count.mockResolvedValue(2);

    const result = await productService.getProductPagination({
      page: "1",
      limit: "2",
    });

    expect(result).toEqual({
      page: 1,
      limit: 2,
      totalProducts: 2,
      products,
    });
    expect(productRepository.find).toHaveBeenCalledWith({ skip: 0, take: 2 });
    expect(productRepository.count).toHaveBeenCalled();
  });

  it("should throw an error for invalid page/limit values", async () => {
    await expect(
      productService.getProductPagination({ page: "-1", limit: "2" }),
    ).rejects.toThrow("Page and limit must be positive integers.");

    await expect(
      productService.getProductPagination({ page: "1", limit: "0" }),
    ).rejects.toThrow("Page and limit must be positive integers.");
  });

  it("should throw an error for out-of-range pages", async () => {
    productRepository.find.mockResolvedValue([]);
    productRepository.count.mockResolvedValue(2);

    await expect(
      productService.getProductPagination({ page: "2", limit: "2" }),
    ).rejects.toThrow(
      "The requested page is out of range. Please adjust the page number.",
    );
  });
  it("should throw an error for invalid limit", async () => {
    await expect(
      productService.getProductPagination({ page: "1", limit: "-1" }),
    ).rejects.toThrow("Page and limit must be positive integers.");
  });
  it("should handle empty products", async () => {
    productRepository.find.mockResolvedValue([]);
    productRepository.count.mockResolvedValue(0);

    const result = await productService.getProductPagination({
      page: "1",
      limit: "2",
    });

    expect(result).toEqual({
      page: 1,
      limit: 2,
      totalProducts: 0,
      products: [],
    });
  });

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

  it("should get a single user product", async () => {
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
