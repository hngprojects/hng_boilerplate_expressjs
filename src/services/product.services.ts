import { getRepository, Repository } from 'typeorm';
import AppDataSource from '../data-source';
import { Product } from '../models/product';

export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

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
  async getOneProduct(id: string): Promise<Product> {

    const product = await this.productRepository.findOneBy({id});

    return product;


  }

}
