import { Request, Response } from "express";
import { ProductService } from "../services/product.services"; // Adjust the import path as necessary
import { ProductDTO } from "../models";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }
  /**
   * @swagger
   * tags:
   *  name: Product
   *  description: Product related routes
   */

  /**
   * @swagger
   * /api/v1/products:
   *   get:
   *     tags:
   *       - Product
   *     summary: Fetch all products
   *     description: API endpoint that retrieves all user list of products with pagination support.
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: The page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: The number of items per page
   *     responses:
   *       200:
   *         description: Successfully retrieved list of products
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
   *                   example: Products retrieved successfully
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     totalItems:
   *                       type: integer
   *                       example: 100
   *                     totalPages:
   *                       type: integer
   *                       example: 10
   *                     currentPage:
   *                       type: integer
   *                       example: 1
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         example: Product 1
   *                       description:
   *                         type: string
   *                         example: Product is very robust
   *                       price:
   *                         type: number
   *                         example: 19
   *                       category:
   *                         type: string
   *                         example: Gadgets
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: The query parameters must be positive integers
   *       404:
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: The requested page is out of range.
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred while processing your request. Please try again later
   */
  async getProductPagination(req: Request, res: Response) {
    try {
      const paginationData = await this.productService.getProductPagination(
        req.query,
      );
      res.status(200).json({
        status: "success",
        status_code: 200,
        data: paginationData,
      });
    } catch (err) {
      if (err.message.includes("out of range")) {
        res.status(400).json({
          error: "Page out of range",
          message: err.message,
          status_code: 400,
        });
      } else if (err.message.includes("positive integers")) {
        res.status(400).json({
          error: "Invalid query parameters",
          message: err.message,
          status_code: 400,
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
          message: err.message,
          status_code: 500,
        });
        console.error(err);
      }
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
  async fetchProductById(req: Request, res: Response) {}

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
  async createProduct(req: Request, res: Response) {
    try {
      const { user } = req;
      const { sanitizedData } = req.body;

      if (!user) {
        return res.status(401).json({
          status: "unsuccessful",
          status_code: 401,
          message: "Unauthorized User",
        });
      }

      const productDTO = new ProductDTO(sanitizedData);
      await productDTO.validate();

      const product = await this.productService.createProduct({
        ...sanitizedData,
        user,
      });

      const { user: _, ...productWithoutUser } = product;

      return res.status(201).json({
        status: "success",
        status_code: 201,
        message: "Product created successfully",
        data: { productWithoutUser },
      });
    } catch (error) {
      // console.error('Error creating product:', error)
      return res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

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

export default ProductController;
