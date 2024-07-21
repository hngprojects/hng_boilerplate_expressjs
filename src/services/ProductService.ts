import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { In } from 'typeorm';

export class ProductService {
  public async createProduct(data: {
    name: string;
    description: string;
    price: number;
    slug: string;
    categoryIds: number[];
  }): Promise<Product> {
    const product = new Product();
    product.name = data.name;
    product.description = data.description;
    product.price = data.price;
    product.slug = data.slug;

    // Fetch categories by IDs
    const categories = await Category.find({ where: { id: In(data.categoryIds) } });
    product.categories = categories;

    return await product.save();
  }
}
