import { Product } from '../models/product';
import { IProduct } from '../types';
import AppDataSource from '../data-source';


export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  public async getProductPagination(query: any): Promise<{ page: number, limit: number, totalProducts: number, products: IProduct[] }> {
    try {
      const page: number = parseInt(query.page as string) || 1;
      const limit: number = parseInt(query.limit as string) || 10;
      const offset: number = (page - 1) * limit;

      if (page <= 0 || limit <= 0) {
        throw new Error("Page and limit must be positive integers.");
      }

      const [products, totalProducts] = await Promise.all([
        this.productRepository.find({ skip: offset, take: limit }),
        this.productRepository.count()
      ]);

      if (products.length === 0 && offset > 0) {
        throw new Error("The requested page is out of range. Please adjust the page number.");
      }

      return {
        page,
        limit,
        totalProducts,
        products
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

