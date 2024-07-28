import { ProductService } from "../services/product.services";
import productController from "../controllers/ProductController";
import { Product } from "../models/product";
import AppDataSource from "../data-source";
import { mock, MockProxy } from "jest-mock-extended";
import { DeleteResult } from "typeorm/browser";
import { Repository } from "typeorm";
import { User } from "../models";

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
});


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
				quantity: 100,
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
				quantity: 100,
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
				quantity: 100,
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
				quantity: 100,
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

