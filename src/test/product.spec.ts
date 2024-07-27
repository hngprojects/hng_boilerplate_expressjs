import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Product } from "../models/product";
import { User } from "../models";
import { ProductService } from "../services";
import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { DeleteResult } from "typeorm/browser";

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
			delete: jest.fn(),
			findOne: jest.fn(),
			save: jest.fn(),
			merge: jest.fn(),
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
				"Error fetching product"
			);
			expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
		});
	});

	describe("deleteProduct", () => {
		it("should successfully delete a product", async () => {
			const id = "some-id";
			const deleteResult: DeleteResult = {
				affected: 1,
				raw: [],
			};

			mockRepository.delete.mockResolvedValue(deleteResult);

			const result = await productService.deleteProductById(id);

			expect(result).toBe(true);
			expect(mockRepository.delete).toHaveBeenCalledWith(id);
		});

		it("should return false when the product does not exist", async () => {
			const id = "non-existing-id";
			const deleteResult: DeleteResult = {
				affected: 0,
				raw: [],
			};

			mockRepository.delete.mockResolvedValue(deleteResult);

			const result = await productService.deleteProductById(id);

			expect(result).toBe(false);
			expect(mockRepository.delete).toHaveBeenCalledWith(id);
		});

		it("should throw an error if there is an issue with deletion", async () => {
			const id = "some-id";
			const error = new Error("Error deleting product");

			mockRepository.delete.mockRejectedValue(error);

			await expect(productService.deleteProductById(id)).rejects.toThrow(
				"Error deleting product"
			);
			expect(mockRepository.delete).toHaveBeenCalledWith(id);
		});
	});

	describe("updateProduct", () => {
		it("should successfully update a product", async () => {
			const productId = "some-id";
			const productData = {
				name: "Updated Product Name",
				description: "Updated description of the product",
				price: 20,
				category: "Electronics",
			};

			const existingProduct = {
				...productData,
				id: productId,
				user: { id: "user-id" },
			};

			mockRepository.findOne.mockResolvedValue(existingProduct as Product);
			mockRepository.save.mockResolvedValue(existingProduct as Product);

			const result = await productService.updateProductById(
				productId,
				productData
			);

			expect(result).toEqual(existingProduct);
			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: productId },
			});
			expect(mockRepository.save).toHaveBeenCalledWith(existingProduct);
		});

		it("should return null if the product does not exist", async () => {
			const productId = "non-existing-id";
			const productData = {
				name: "Updated Product Name",
				description: "Updated description of the product",
				price: 20,
				category: "Electronics",
			};

			mockRepository.findOne.mockResolvedValue(null);

			const result = await productService.updateProductById(
				productId,
				productData
			);

			expect(result).toBeNull();
			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: productId },
			});
		});

		it("should throw an error if there is an issue with updating the product", async () => {
			const productId = "123";
			const productData = {
				name: "Updated Product Name",
				description: "Updated description of the product",
				price: 20,
				category: "Electronics",
			};

			const existingProduct = {
				...productData,
				id: productId,
				user: { id: "user-id" },
			};

			const error = new Error("Update failed");

			mockRepository.findOne.mockResolvedValue(existingProduct as Product);
			mockRepository.save.mockRejectedValue(error);

			await expect(
				productService.updateProductById(productId, productData)
			).rejects.toThrow("Update failed");
			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: "123" },
			});
			expect(mockRepository.save).toHaveBeenCalledWith(existingProduct);
		});
	});
});
