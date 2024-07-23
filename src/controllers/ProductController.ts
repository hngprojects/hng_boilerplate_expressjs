import { ProductService } from "../services/product.services";
import { Request, Response } from "express";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }
  async listProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page <= 0 || limit <= 0) {
        res.status(400).json({
          status: "bad request",
          message: "Invalid query params passed",
          status_code: 400,
        });
        return;
      }

      const { products, totalItems } =
        await this.productService.getPaginatedProducts(page, limit);

      res.json({
        success: true,
        message: "Products retrieved successfully",
        products: products.map((product) => ({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
        })),
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
        status_code: 200,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }

  async getSpecificProduct(req: Request, res: Response) {
    try {
      const product_service = new ProductService();
      const product = await product_service.getProduct(req.params.id);
      if (!product)
        return res.status(404).json({
          status: "Unsuccessful",
          message: "Product does not exist",
          status_code: 404,
        });
      res.json(product);
    } catch (error) {
      res.status(500).json({
        status: "Unsuccessful",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }
}
