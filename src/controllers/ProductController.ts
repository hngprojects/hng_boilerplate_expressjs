import { ProductService } from "../services/product.services";
import { Request, Response } from "express";
import { validateUUID } from "../utils/helper";

export class ProductController {
  private productService = new ProductService();

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

  /**
   * @swagger
   * /api/v1/products/{product_id}:
   *   get:
   *     summary: Fetch a product by {id}
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: String ID of the product
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: 123
   *                 name:
   *                   type: string
   *                   example: Product 1
   *                 description:
   *                   type: string
   *                   example: Product is robust
   *                 price:
   *                   type: number
   *                   exanple: 19
   *                 category:
   *                   type: string
   *                   example: Gadgets
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Invalid product ID
   *       404:
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Product not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: An unexpected error occurred
   */
  async fetchProductById(req: Request, res: Response) {
    const product_service = new ProductService();
    try {
      if (!validateUUID(req.params.product_id))
        return res.status(400).json({
          status: "Unsuccessful",
          message: "Invalid product ID",
          status_code: 400,
        });
      const product = await product_service.getProduct(req.params.product_id);

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

  /**
   * @swagger
   * /api/v1/products/{product_id}:
   *   put:
   *     tags:
   *       - Product
   *     summary: Update a product
   *     description: Update an existing product's information
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the product to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The updated name of the product
   *               description:
   *                 type: string
   *                 description: The updated description of the product
   *               price:
   *                 type: number
   *                 format: float
   *                 description: The updated price of the product
   *               stock:
   *                 type: integer
   *                 description: The updated stock quantity of the product
   *     responses:
   *       200:
   *         description: Product successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Product updated successfully.
   *                 data:
   *                   type: object
   *                   properties:
   *                     product_id:
   *                       type: string
   *                       example: "123"
   *                     name:
   *                       type: string
   *                       example: Product 1
   *                     description:
   *                       type: string
   *                       example: Product is robust
   *                     price:
   *                       type: number
   *                       format: float
   *                       example: 19.99
   *                     category:
   *                       type: string
   *                       example: Gadgets
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "Product with id '123' not found"
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Error
   *                 status_code:
   *                   type: integer
   *                   example: 422
   *                 message:
   *                   type: string
   *                   example: "Valid product ID, name, description, price, and stock must be provided."
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Fail
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: "Failed to update product. Please try again later."
   */

  async updateProductById(req: Request, res: Response) {}

  /**
   * @swagger
   * /api/v1/products:
   *   post:
   *     tags:
   *       - Product
   *     summary: Create a product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               category:
   *                 type: string
   *     responses:
   *       201:
   *         description: The product was Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     description:
   *                       type: string
   *                     price:
   *                       type: number
   *                     category:
   *                       type: string
   *       401:
   *         description: Unauthorized user | Invalid product detail
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: number
   *                 message:
   *                   type: string
   *       500:
   *         description: Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: number
   *                 message:
   *                   type: string
   */
  async createProduct(req: Request, res: Response) {}

  /**
   * @swagger
   * /api/v1/products/{product_id}:
   *   delete:
   *     summary: Delete a product
   *     security:
   *       - bearerAuth: []
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the product to delete
   *     responses:
   *       204:
   *         description: Product successfully deleted
   *         content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  example: success
   *                status_code:
   *                  type: number
   *                  example: 204
   *                message:
   *                  type: string
   *                  example: Product deleted successfully
   *
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: number
   *                 message:
   *                   type: string
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Bad Request
   *                 status_code:
   *                   type: number
   *                   example: 401
   *                 message:
   *                   type: string
   *                   example: Authentication required
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Not found
   *                 status_code:
   *                   type: number
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: Product not found
   */
  async deleteProduct(req: Request, res: Response) {}
}
