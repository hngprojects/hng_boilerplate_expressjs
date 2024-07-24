import { ProductService } from "../services/product.services";
import productController from "../controllers/ProductController";
import { Product } from "../models/product";
import AppDataSource from "../data-source";
import { mock, MockProxy } from "jest-mock-extended";

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

// import { ProductService } from '../services/product.services';
// import { Product } from '../models/product';
// import AppDataSource from '../data-source';
// import { mock, MockProxy } from 'jest-mock-extended';

// describe('ProductService', () => {
//   let productService: ProductService;
//   let productRepository: MockProxy<any>;

//   beforeEach(() => {
//     productRepository = mock();
//     AppDataSource.getRepository = jest.fn().mockReturnValue(productRepository);
//     productService = new ProductService();
//   });

//   it('should return paginated products', async () => {
//     const products = [
//       { id: 1, name: 'Product 1', price: 100, description: 'Product description', category: 'Category 1' },
//       { id: 2, name: 'Product 2', price: 200, description: 'Product description', category: 'Category 2' }
//     ];
//     productRepository.find.mockResolvedValue(products);
//     productRepository.count.mockResolvedValue(2);

//     const result = await productService.getProductPagination({ page: '1', limit: '2' });

//     expect(result).toEqual({
//       page: 1,
//       limit: 2,
//       totalProducts: 2,
//       products
//     });
//     expect(productRepository.find).toHaveBeenCalledWith({ skip: 0, take: 2 });
//     expect(productRepository.count).toHaveBeenCalled();
//   });

//   it('should throw an error for invalid page/limit values', async () => {
//     await expect(productService.getProductPagination({ page: '-1', limit: '2' }))
//       .rejects
//       .toThrow("Page and limit must be positive integers.");

//     await expect(productService.getProductPagination({ page: '1', limit: '0' }))
//       .rejects
//       .toThrow("Page and limit must be positive integers.");
//   });

//   it('should throw an error for out-of-range pages', async () => {
//     productRepository.find.mockResolvedValue([]);
//     productRepository.count.mockResolvedValue(2);

//     await expect(productService.getProductPagination({ page: '2', limit: '2' }))
//       .rejects
//       .toThrow("The requested page is out of range. Please adjust the page number.");
//   });
// });
