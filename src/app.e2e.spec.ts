import { AppDataSource } from './data-source'; // Adjust the import path as necessary
import { Product } from './models/product';
import { ProductService } from './services/product.services';

describe('ProductService', () => {
  let productService: ProductService;

  beforeAll(async () => {
    try {
      await AppDataSource.initialize();
      productService = new ProductService();
    } catch (error) {
      console.error('Failed to initialize AppDataSource:', error);
    }
  }, 10000); // Increase timeout to 10 seconds

  afterAll(async () => {
    try {
      await AppDataSource.destroy();
    } catch (error) {
      console.error('Failed to destroy AppDataSource:', error);
    }
  });

  beforeEach(async () => {
    // Clean up the database
    await AppDataSource.getRepository(Product).clear();
  });

  test('should return paginated products', async () => {
    // Seed your database with sample data
    await AppDataSource.getRepository(Product).save([
      {
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        category: 'Category 1',
        user: null,
      },
      {
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        category: 'Category 2',
        user: null,
      },
    ]);

    const page = 1;
    const limit = 1;
    const result = await productService.getPaginatedProducts(page, limit);

    // Expect one product on the current page
    expect(result.products).toHaveLength(1);
    // Expect the total items to be 2
    expect(result.totalItems).toBe(2);
  });
});
