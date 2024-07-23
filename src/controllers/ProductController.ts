import { Request, Response } from "express";
import { ProductService } from "../services/product.services";

class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getProductPagination(req: Request, res: Response) {
    try {
      const paginationData = await this.productService.getProductPagination(req.query);
      res.status(200).json({
        status: "success",
        status_code: 200,
        data: paginationData
      });
    } catch (err) {
      if (err.message.includes("out of range")) {
        res.status(400).json({
          error: "Page out of range",
          message: err.message,
          status_code: 400
        });
      } else if (err.message.includes("positive integers")) {
        res.status(400).json({
          error: "Invalid query parameters",
          message: err.message,
          status_code: 400
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
          message: err.message,
          status_code: 500
        });
        console.error(err);
      }
    }
  }
}

export default ProductController;