import AppDataSource from "../data-source";
import { Product } from "../models";

export class ProductService {
  async getPaginatedProducts(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; totalItems: number }> {
    const productRepository = AppDataSource.getRepository(Product);

    const [products, totalItems] = await productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, totalItems };
  }

  public async getProduct(id: string): Promise<Product | null> {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id },
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }
}
