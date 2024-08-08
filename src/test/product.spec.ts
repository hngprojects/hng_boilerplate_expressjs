import { ProductService } from "../services/product.services";
import { Repository } from "typeorm";
import { Product } from "../models/product";
import { StockStatus } from "../enums/product";
import { ProductSchema } from "../schema/product.schema";
import { Organization } from "../models/organization";
import { ServerError, ResourceNotFound } from "../middleware";

jest.mock("../utils", () => ({
  getIsInvalidMessage: jest
    .fn()
    .mockImplementation((field: string) => `${field} is invalid`),
}));

jest.mock("../data-source", () => ({
  getRepository: jest.fn().mockImplementation((entity) => ({
    create: jest.fn().mockReturnValue({}),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    })),
  })),
}));

describe("ProductService", () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;
  let organizationRepository: Repository<Organization>;

  beforeEach(() => {
    productService = new ProductService();
    productRepository = productService["productRepository"];
    organizationRepository = productService["organizationRepository"];
  });

  describe("createProducts", () => {
    it("should create a product successfully", async () => {
      // Mock data
      const mockOrgId = "1";
      const mockProduct: ProductSchema = {
        name: "Test Product",
        description: "This is a test product",
        price: 50,
        quantity: 50,
      };
      const mockOrganization = { id: "1", name: "Test Organization" };
      const mockCreatedProduct = {
        ...mockProduct,
        id: "1",
        stock_status: StockStatus.IN_STOCK,
      };

      productService["checkEntities"] = jest
        .fn()
        .mockResolvedValue({ organization: mockOrganization });
      productRepository.create = jest.fn().mockReturnValue(mockCreatedProduct);
      productRepository.save = jest.fn().mockResolvedValue(mockCreatedProduct);
      organizationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockOrganization);
      productService["calculateProductStatus"] = jest
        .fn()
        .mockResolvedValue(StockStatus.IN_STOCK);

      const result = await productService.createProduct(mockOrgId, mockProduct);
      expect(result.status_code).toEqual(201);
      expect(result.status).toEqual("success");
      expect(result.message).toEqual("Product created successfully");
      expect(result.data.name).toEqual(mockProduct.name);
      expect(result.data.description).toEqual(mockProduct.description);
      expect(result.data.price).toEqual(mockProduct.price);
      expect(result.data.quantity).toEqual(mockProduct.quantity);
      expect(result.data.status).toEqual(StockStatus.IN_STOCK);
    });

    it("should throw an error when credentials are invalid", async () => {
      const mockOrgId = "nonexistentOrg";
      const mockProduct: ProductSchema = {
        name: "Test Product",
        description: "This is a test product",
        price: 50,
        quantity: 10,
      };

      productService["checkEntities"] = jest
        .fn()
        .mockResolvedValue({ organization: undefined });
      await expect(
        productService.createProduct(mockOrgId, mockProduct),
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error when product data is invalid", async () => {
      const mockOrgId = "1";
      const invalidProduct: ProductSchema = {
        name: "",
        description: "This is a test product",
        price: -10,
        quantity: 50,
      };
      const mockOrganization = { id: "1", name: "Test Organization" };

      productService["checkEntities"] = jest
        .fn()
        .mockResolvedValue({ organization: mockOrganization });

      await expect(
        productService.createProduct(mockOrgId, invalidProduct),
      ).rejects.toThrow(Error);
    });

    it("should throw a server error when product creation fails", async () => {
      const mockOrgId = "1";
      const mockProduct: ProductSchema = {
        name: "Test Product",
        description: "This is a test product",
        price: 50,
        quantity: 10,
      };

      productService["checkEntities"] = jest.fn().mockResolvedValue({});
      productRepository.create = jest.fn().mockReturnValue(mockProduct);
      productRepository.save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await expect(
        productService.createProduct(mockOrgId, mockProduct),
      ).rejects.toThrow(ServerError);
    });
  });
  describe("getProducts", () => {
    it("should search products successfully", async () => {
      const mockOrgId = "1";
      const mockQuery = { name: "Test", minPrice: 0, maxPrice: 100 };
      const mockOrg = { id: "1", name: "Test Organization" };
      const mockProducts = [{ id: "1", name: "Test Product", price: 50 }];
      const mockTotalCount = 2;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockProducts, mockTotalCount]),
      };

      productRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);
      organizationRepository.findOne = jest.fn().mockResolvedValue(mockOrg);

      const result = await productService.getProducts(mockOrgId, mockQuery);
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data.products).toEqual(mockProducts);
      expect(result.data.pagination.total).toBe(mockTotalCount);
      expect(result.data.pagination.page).toBe(1);
      expect(result.data.pagination.limit).toBe(10);
    });
    it("should search products successfully with specified pagination", async () => {
      const mockOrgId = "1";
      const mockQuery = { name: "Test", minPrice: 0, maxPrice: 100 };
      const mockPage = 2;
      const mockLimit = 5;
      const mockOrg = { id: "1", name: "Test Organization" };
      const mockProducts = [{ id: "1", name: "Test Product", price: 50 }];
      const mockTotalCount = 5;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockProducts, mockTotalCount]),
      };

      productRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);
      organizationRepository.findOne = jest.fn().mockResolvedValue(mockOrg);

      const result = await productService.getProducts(
        mockOrgId,
        mockQuery,
        mockPage,
        mockLimit,
      );
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data.pagination.total).toBe(mockTotalCount);
      expect(result.data.pagination.page).toBe(mockPage);
      expect(result.data.pagination.limit).toBe(mockLimit);
    });

    it("should return an empty product array when product is not found", async () => {
      const mockOrgId = "1";
      const mockQuery = { name: "Nonexistent Product" };
      const mockOrg = { id: "1", name: "Test Organization" };
      const mockTotalCount = 0;
      const mockProducts = [];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      productRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(mockQueryBuilder);
      organizationRepository.findOne = jest.fn().mockResolvedValue(mockOrg);

      const result = await productService.getProducts(mockOrgId, mockQuery);
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data.pagination.total).toBe(mockTotalCount);
      expect(result.data.products).toStrictEqual(mockProducts);
    });

    it("should throw a ServerError when organization is not found", async () => {
      const mockOrgId = "nonexistentOrg";
      const mockQuery = { name: "Test Product" };

      organizationRepository.findOne = jest.fn().mockResolvedValue(undefined);

      await expect(
        productService.getProducts(mockOrgId, mockQuery),
      ).rejects.toThrow(ServerError);
    });

    it("should throw a server error when organization is not found", async () => {
      const mockOrgId = "nonexistentOrg";
      const mockQuery = { name: "Test Product" };

      organizationRepository.findOne = jest.fn().mockResolvedValue(undefined);

      await expect(
        productService.getProducts(mockOrgId, mockQuery),
      ).rejects.toThrow(ServerError);
    });
  });
});
