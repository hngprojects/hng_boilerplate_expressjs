import { Request, Response } from "express";
import { ProductService } from "../services";
import { Product } from "../models";
import log from "../utils/logger";

export class ProductController {
  private productService = new ProductService();

  // GET PAGINATED PRODUCT LIST
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
          id: product.id,
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

 
// UPDATE PRODUCT 
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { product_id } = req.params;
      const { name, description, price, category } = req.body;

      if (!product_id) {
        res.status(400).json({
          status: "bad request",
          message: "Product ID is required",
          status_code: 400,
        });
        return;
      }

      // Validate that the product_id is a valid UUID
      if (!isValidUUID(product_id)) {
        res.status(400).json({
          status: "bad request",
          message: "Invalid Product ID",
          status_code: 400,
        });
        return;
      }

      const existingProduct = await this.productService.getProductById(product_id);

      if (!existingProduct) {
        res.status(404).json({
          status: "not found",
          message: "Product not found",
          status_code: 404,
        });
        return;
      }

      const updateData: Partial<Product> = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = price;
      if (category) updateData.category = category;

      if (Object.keys(updateData).length === 0) {
        res.status(200).json({
          status: "success",
          message: "No update",
          product: existingProduct,
          status_code: 200,
        });
        return;
      }

      // Update the product with the provided data
      const updatedProduct = await this.productService.updateProduct(product_id, updateData);

      res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        product: updatedProduct,
        status_code: 200,
      });
    } catch (error) {
      log.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }
}

// validate UUIDs
function isValidUUID(uuid: string): boolean {
  const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regexExp.test(uuid);
}
