import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, slug, categoryIds } = req.body;

      if (!name || !description || !price || !slug || !categoryIds) {
        return res.status(400).json({
          status_code: 400,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields.',
          },
        });
      }

      const product = await this.productService.createProduct({
        name,
        description,
        price,
        slug,
        categoryIds,
      });

      return res.status(201).json({
        status_code: 201,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        status_code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request.',
          details: {
            support_email: 'support@example.com',
          },
        },
      });
    }
  }
}
