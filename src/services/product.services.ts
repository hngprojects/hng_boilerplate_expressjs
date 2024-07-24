import { Product } from "../models/product";
import { IProduct } from "../types";
import AppDataSource from "../data-source";

export class ProductService {
  getPaginatedProducts(
    page: number,
    limit: number,
  ):
    | { products: any; totalItems: any }
    | PromiseLike<{ products: any; totalItems: any }> {
    throw new Error("Method not implemented.");
  }
  private productRepository = AppDataSource.getRepository(Product);

  public async getProductPagination(query: any): Promise<{
    page: number;
    limit: number;
    totalProducts: number;
    products: IProduct[];
  }> {
    try {
      const page: number = parseInt(query.page as string, 10);
      const limit: number = parseInt(query.limit as string, 10);

      if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
        throw new Error("Page and limit must be positive integers.");
      }

      const offset: number = (page - 1) * limit;

      const [products, totalProducts] = await Promise.all([
        this.productRepository.find({ skip: offset, take: limit }),
        this.productRepository.count(),
      ]);

      if (!products) {
        throw new Error("Error retrieving products.");
      }

      if (products.length === 0 && offset > 0) {
        throw new Error(
          "The requested page is out of range. Please adjust the page number.",
        );
      }

      return {
        page,
        limit,
        totalProducts,
        products,
      };
    } catch (err) {
      // Log error details for debugging
      throw new Error(err.message);
    }
  }
  async getOneProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    return product;
  }
}
