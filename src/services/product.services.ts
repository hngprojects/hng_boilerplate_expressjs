import { Product } from "../models/product";
import { IProduct } from "../types";
import AppDataSource from "../data-source";
import { ProductDTO } from "../models/product";

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

  async deleteProductById(id: string): Promise<boolean> {
    const deleteResult = await this.productRepository.delete(id);
    return deleteResult.affected !== 0;
  }
  async updateProductById(
    productId: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      return null;
    }
    this.productRepository.merge(product, productData);
    return this.productRepository.save(product);
  }

  public async createProduct(
    productDetails: Partial<ProductDTO>,
  ): Promise<Product> {
    let product = this.productRepository.create(productDetails);
    product = await this.productRepository.save(product);
    return product;
  }
}
