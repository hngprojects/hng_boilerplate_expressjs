import { Request, Response } from "express";
import { ProductController } from "../controllers/ProductController";
import { ProductService } from "../services/product.services";
import { ProductDTO } from "../models/product";
import * as organizationValidation from "../middleware/organization.validation";
import { ValidationError } from "class-validator";

jest.mock("../services/product.services");
jest.mock("../models/product");
jest.mock("../middleware/organization.validation");

describe("ProductController", () => {
  let productController: ProductController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUser: any;

  beforeEach(() => {
    productController = new ProductController();
    mockUser = { id: "user123", name: "Test User" };
    mockRequest = {
      body: {
        name: "Test Product",
        description: "Test Description",
        price: 10.99,
        category: "Test Category",
      },
      user: mockUser,
      params: { org_id: "org123" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock ProductService methods
    (ProductService.prototype.createProduct as jest.Mock).mockResolvedValue({
      id: "product123",
      ...mockRequest.body,
      user: mockUser,
    });

    // Mock ProductDTO validate method
    (ProductDTO.prototype.validate as jest.Mock) = jest
      .fn()
      .mockResolvedValue(undefined);

    // Mock organizationValidation
    (organizationValidation.validateUserToOrg as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: Function) => next(),
    );
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

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
        data: expect.objectContaining({
          id: "product123",
          name: "Test Product",
          description: "Test Description",
          price: 10.99,
          category: "Test Category",
        }),
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

    it("should return 401 if org_id is missing", async () => {
      mockRequest.params = {};

      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "unsuccessful",
        status_code: 401,
        message: "org_id not found",
      });
    });

    it("should handle validation errors", async () => {
      const validationErrors = [new ValidationError()];
      validationErrors[0].property = "name";
      validationErrors[0].constraints = {
        isNotEmpty: "Name should not be empty",
      };

      (ProductDTO.prototype.validate as jest.Mock).mockRejectedValue(
        validationErrors,
      );

      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "unsuccessful",
        status_code: 401,
        message: "Validation error",
        errors: [
          {
            property: "name",
            constraints: { isNotEmpty: "Name should not be empty" },
          },
        ],
      });
    });

    it("should handle internal server errors", async () => {
      const errorMessage = "Internal server error";
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
  });
});
