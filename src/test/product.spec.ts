import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Product } from "../models/product";
import { User } from "../models";
import { ProductService } from "../services";
import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));

describe("ProductService", () => {
  let productService: ProductService;
  let mockRepository: jest.Mocked<Repository<Product>>;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      // Add other methods if needed
    } as any;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    productService = new ProductService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchProductById", () => {
    it("should return the product if it exists", async () => {
      const productId = "123";
      const user: User = {
        id: "user-123",
        name: "John Doe",
        // Add any other necessary properties
      } as User;
      const product = {
        id: "123",
        name: "Product 1",
        description: "Product is robust",
        price: 19,
        category: "Gadgets",
        user: user,
      } as Product;

      mockRepository.findOneBy.mockResolvedValue(product);

      const result = await productService.getOneProduct(productId);
      expect(result).toEqual(product);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
    });

    it("should return null if the product does not exist", async () => {
      const productId = "non-existing-id";

      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await productService.getOneProduct(productId);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
    });

    it("should throw an error if there is an issue with fetching the product", async () => {
      const productId = "123";
      const error = new Error("Error fetching product");

      mockRepository.findOneBy.mockRejectedValue(error);

      await expect(productService.getOneProduct(productId)).rejects.toThrow(
        "Error fetching product",
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
    });
  });
});
