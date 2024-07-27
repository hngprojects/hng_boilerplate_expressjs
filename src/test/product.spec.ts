// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { ProductController } from "../controllers/ProductController";
import { ProductService } from "../services";
import { ProductDTO } from "../models/product";
import { validateProductDetails } from "../middleware/product";
import { validationResult, body } from "express-validator";

// get one product
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Product } from "../models/product";
import { User } from "../models";
import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";

// Mock the external dependencies
jest.mock("../services/product.services.ts");
jest.mock("../models/product");
jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    trim: jest.fn().mockReturnThis(),
    escape: jest.fn().mockReturnThis(),
  })),
  validationResult: jest.fn(),
}));

describe("ProductController - createProduct", () => {
  let productController: ProductController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUser: any;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    productController = new ProductController();
    mockUser = { id: "1", name: "sampleUser", email: "user@sample.com" };
    mockRequest = {
      body: {
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
        category: "Test Category",
      },
      user: mockUser,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });
    nextFunction.mockClear();

    // Mock ProductService methods
    (ProductService.prototype.createProduct as jest.Mock).mockResolvedValue({
      id: "product123",
      user: mockUser,
      ...mockRequest.body.sanitizedData,
    });

    // Mock ProductDTO validate method
    (ProductDTO.prototype.validate as jest.Mock) = jest
      .fn()
      .mockResolvedValue(undefined);
  });

  const runMiddleware = async (
    middleware: any,
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction,
  ) => {
    if (typeof middleware === "function") {
      await middleware(req as Request, res as Response, next);
    }
  };

  it("should create a product successfully", async () => {
    for (const middleware of validateProductDetails) {
      await runMiddleware(middleware, mockRequest, mockResponse, nextFunction);
    }
    await productController.createProduct(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(ProductDTO.prototype.validate).toHaveBeenCalled();
    expect(ProductService.prototype.createProduct).toHaveBeenCalledWith({
      ...mockRequest.body,
      user: mockUser,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      status_code: 201,
      message: "Product created successfully",
      data: {
        id: "product123",
        ...mockRequest.body.sanitizedData,
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockRequest.user = undefined;

    await productController.createProduct(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "unsuccessful",
      status_code: 401,
      message: "Unauthorized User",
    });
  });

  it("should handle errors and return 500", async () => {
    const errorMessage = "Test error";
    (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    await productController.createProduct(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "unsuccessful",
      status_code: 500,
      message: "Internal server error",
      error: errorMessage,
    });
  });

  it("should validate and sanitize inputs", async () => {
    mockRequest.body = {
      name: '  Test <script>alert("XSS")</script>  ',
      description: "  Description with &quot;quotes&quot;  ",
      category: "  Unsafe Category & More  ",
      price: 10.99,
    };

    for (const middleware of validateProductDetails) {
      await runMiddleware(middleware, mockRequest, mockResponse, nextFunction);
    }

    expect(body).toHaveBeenCalledWith("name");
    expect(body).toHaveBeenCalledWith("description");
    expect(body).toHaveBeenCalledWith("category");
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should return 400 if validation fails", async () => {
    const mockErrors = [
      { msg: "Name is required", param: "name", location: "body" },
    ];

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(mockErrors),
    });

    await runMiddleware(
      validateProductDetails[validateProductDetails.length - 1],
      mockRequest,
      mockResponse,
      nextFunction,
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ errors: mockErrors });
  });
});

// get one product

// jest.mock("../data-source", () => ({
//   __esModule: true,
//   default: {
//     getRepository: jest.fn(),
//     initialize: jest.fn(),
//     isInitialized: false
//   }
// }));

// describe("ProductService - getOneProduct", () => {
//   let productService: ProductService;
//   let mockRepository: jest.Mocked<Repository<Product>>;

//   beforeEach(() => {
//     mockRepository = {
//       findOneBy: jest.fn()
//       // Add other methods if needed
//     } as any;

//     (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

//     productService = new ProductService();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   describe("fetchProductById", () => {
//     it("should return the product if it exists", async () => {
//       const productId = "123";
//       const user: User = {
//         id: "user-123",
//         name: "John Doe"
//         // Add any other necessary properties
//       } as User;
//       const product = {
//         id: "123",
//         name: "Product 1",
//         description: "Product is robust",
//         price: 19,
//         category: "Gadgets",
//         user: user
//       } as Product;

//       mockRepository.findOneBy.mockResolvedValue(product);

//       const result = await productService.getOneProduct(productId);
//       expect(result).toEqual(product);
//       expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
//     });

//     it("should return null if the product does not exist", async () => {
//       const productId = "non-existing-id";

//       mockRepository.findOneBy.mockResolvedValue(null);

//       const result = await productService.getOneProduct(productId);

//       expect(result).toBeNull();
//       expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
//     });

//     it("should throw an error if there is an issue with fetching the product", async () => {
//       const productId = "123";
//       const error = new Error("Error fetching product");

//       mockRepository.findOneBy.mockRejectedValue(error);

//       await expect(productService.getOneProduct(productId)).rejects.toThrow(
//         "Error fetching product"
//       );
//       expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
//     });
//   });
// });
