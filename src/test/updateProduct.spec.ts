import { ProductService } from "../services";
import { Repository } from "typeorm";
import { Product, User, Organization } from "../models";
import AppDataSource from "../data-source";
import { ResourceNotFound, Unauthorized, ServerError } from "../middleware";
import { ProductSchema } from "../schema/product.schema";

jest.mock("../data-source");

describe("ProductService", () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<Repository<Product>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let organizationRepository: jest.Mocked<Repository<Organization>>;

  beforeEach(() => {
    productRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    userRepository = {
      findOne: jest.fn(),
    } as any;

    organizationRepository = {
      findOne: jest.fn(),
    } as any;

    AppDataSource.getRepository = jest.fn().mockImplementation((model) => {
      if (model === Product) return productRepository;
      if (model === User) return userRepository;
      if (model === Organization) return organizationRepository;
      throw new Error("Unknown model");
    });

    productService = new ProductService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateProduct", () => {
    it("should successfully update a product", async () => {
      const orgId = "org-123";
      const productId = "product-123";
      const userId = "admin-user";
      const payload = {
        name: "Updated Product",
        description: "Updated description",
        price: 100,
        category: "Updated category",
        image: "updated-image.jpg",
        quantity: 20,
        size: "L",
      };

      const mockUser = { id: userId, role: "admin" } as User;
      const mockOrganization = { id: orgId } as Organization;
      const existingProduct = {
        id: productId,
        org: { id: orgId },
        stock_status: "in stock",
        ...payload,
        created_at: new Date(),
        updated_at: new Date(),
      } as Product;

      productRepository.findOne.mockResolvedValue(existingProduct);
      userRepository.findOne.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue(mockOrganization);
      productRepository.save.mockResolvedValue(existingProduct);

      const result = await productService.updateProduct(
        orgId,
        productId,
        payload,
        userId,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: orgId },
      });
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ["org"],
      });
      expect(productRepository.save).toHaveBeenCalledWith(existingProduct);
      expect(result).toEqual({
        status_code: 200,
        message: "Product updated successfully",
        data: {
          id: productId,
          stock_status: "in stock",
          ...payload,
          created_at: existingProduct.created_at,
          updated_at: existingProduct.updated_at,
        },
      });
    });

    it("should throw ResourceNotFound if the user does not exist", async () => {
      const orgId = "org-123";
      const productId = "product-123";
      const userId = "non-existent-user";
      const payload = {} as Product;

      userRepository.findOne.mockResolvedValue(null);

      await expect(
        productService.updateProduct(orgId, productId, payload, userId),
      ).rejects.toThrow(ResourceNotFound);
    });

    it("should throw Unauthorized if the user is not an admin", async () => {
      const orgId = "org-123";
      const productId = "product-123";
      const userId = "regular-user";
      const payload = {} as Product;

      const mockUser = { id: userId, role: "user" } as User;
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        productService.updateProduct(orgId, productId, payload, userId),
      ).rejects.toThrow(Unauthorized);
    });

    it("should throw ResourceNotFound if the organization does not exist", async () => {
      const orgId = "org-123";
      const productId = "product-123";
      const userId = "admin-user";
      const payload = {} as Product;

      const mockUser = { id: userId, role: "admin" } as User;
      userRepository.findOne.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue(null);

      await expect(
        productService.updateProduct(orgId, productId, payload, userId),
      ).rejects.toThrow(ResourceNotFound);
    });

    it("should throw ResourceNotFound if the product does not belong to the organization or does not exist", async () => {
      const orgId = "org-123";
      const productId = "product-123";
      const userId = "admin-user";
      const payload = {} as Product;

      const mockUser = { id: userId, role: "admin" } as User;
      const mockOrganization = { id: orgId } as Organization;
      userRepository.findOne.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue(mockOrganization);
      productRepository.findOne.mockResolvedValue({
        id: productId,
        org: { id: "other-org-id" },
      } as Product);

      await expect(
        productService.updateProduct(orgId, productId, payload, userId),
      ).rejects.toThrow(ResourceNotFound);
    });
  });
});
