import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { Product } from "../models/product";

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

  // Method to get a product by ID
  async getProductById(productId: string): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id: productId } });
  }

  // Method to update a product
  async updateProduct(productId: string, updateData: Partial<Product>): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      return null;
    }

    if (updateData.name) product.name = updateData.name;
    if (updateData.description) product.description = updateData.description;
    if (updateData.price) product.price = updateData.price;
    if (updateData.category) product.category = updateData.category;

    await this.productRepository.save(product);

    return product;
  }
}
