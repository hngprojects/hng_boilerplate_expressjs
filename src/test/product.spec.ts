import { ProductService } from "../services/product";
import { Repository } from "typeorm";
import { Product, StockStatusType } from "../models/product";
import { ProductSchema } from "../schemas/product";
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
        stock_status: StockStatusType.IN_STOCK,
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
        .mockResolvedValue(StockStatusType.IN_STOCK);

      const result = await productService.createProduct(mockOrgId, mockProduct);
      expect(result.status_code).toEqual(201);
      expect(result.status).toEqual("success");
      expect(result.message).toEqual("Product created successfully");
      expect(result.data.name).toEqual(mockProduct.name);
      expect(result.data.description).toEqual(mockProduct.description);
      expect(result.data.price).toEqual(mockProduct.price);
      expect(result.data.quantity).toEqual(mockProduct.quantity);
      expect(result.data.status).toEqual(StockStatusType.IN_STOCK);
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

  describe("updateProduct", () => {
    const orgId = "org123";
    const productId = "prod456";
    const updateDetails: ProductSchema = {
      name: "Updated Product",
      description: "Updated description",
      price: 19.99,
      quantity: 10,
    };

    it("should successfully update a product", async () => {
      const mockOrganization = { id: orgId };
      const mockProduct = {
        id: productId,
        name: "Old Name",
        description: "Old description",
        price: 9.99,
        quantity: 5,
        stock_status: StockStatusType.LOW_STOCK,
      };

      productService["checkEntities"] = jest.fn().mockResolvedValue({
        organization: mockOrganization,
        product: mockProduct,
      });

      const updatedProduct = {
        ...mockProduct,
        ...updateDetails,
        stock_status: StockStatusType.IN_STOCK,
      };

      productRepository.save = jest.fn().mockResolvedValue(updatedProduct);

      await productService.updateProduct(orgId, productId, updateDetails);

      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDetails),
      );
    });

    it("should throw ResourceNotFound if organization or product doesn't exist", async () => {
      productService["checkEntities"] = jest
        .fn()
        .mockRejectedValue(new ResourceNotFound("Entity not found"));

      await expect(
        productService.updateProduct(orgId, productId, updateDetails),
      ).rejects.toThrow(ResourceNotFound);
    });

    it("should throw ServerError if update fails", async () => {
      productService["checkEntities"] = jest.fn().mockResolvedValue({
        organization: { id: orgId },
        product: { id: productId },
      });

      // Mock save to return null, which should trigger the ServerError
      productRepository.save = jest.fn().mockResolvedValue(null);

      await expect(
        productService.updateProduct(orgId, productId, updateDetails),
      ).rejects.toThrow(ServerError);
      await expect(
        productService.updateProduct(orgId, productId, updateDetails),
      ).rejects.toThrow("Internal server Error");
    });
  });
});
