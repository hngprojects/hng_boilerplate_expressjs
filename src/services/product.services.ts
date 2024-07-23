import AppDataSource from "../data-source";
import { Product } from "../models";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async getPaginatedProducts(
    page: number,
    limit: number
  ): Promise<{ products: Product[]; totalItems: number }> {
    const [products, totalItems] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, totalItems };
  }

  public async getProduct(id: string): Promise<Product | null> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }
}
