import { Request, Response } from "express";
import { ProductService } from "../services/product.services"; // Adjust the import path as necessary
import { ProductDTO } from "../models";
import { ValidationError } from "class-validator";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @swagger
   * /api/v1/products/:org_id:
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
      const { org_id } = req.params;
      const paginationData = await this.productService.getProductPagination(
        req.query,
      );

      if (!org_id) {
        return res.status(401).json({
          status: "unsuccessful",
          status_code: 401,
          message: "org_id not found",
        });
      }

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
      }
    }
  }

  /**
   * @swagger
   * /api/v1/products/{product_id}:
   *   get:
   *     summary: Fetch a product by its ID
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the product to fetch
   *     responses:
   *       200:
   *         description: Product retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 123
   *                 name:
   *                   type: string
   *                   example: Product 1
   *                 description:
   *                   type: string
   *                   example: Product is robust
   *                 price:
   *                   type: number
   *                   example: 19
   *                 category:
   *                   type: string
   *                   example: Gadgets
   *       400:
   *         description: Bad request due to invalid product ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Bad Request
   *                 message:
   *                   type: string
   *                   example: Invalid Product Id
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Not Found
   *                 message:
   *                   type: string
   *                   example: Product not found
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: An unexpected error occurred
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */

  async fetchProductById(req: Request, res: Response) {
    const productId = req.params.product_id;

    if (!productId) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Invalid Product Id",
        status_code: 400,
      });
    }

    try {
      const product = await this.productService.getOneProduct(productId);
      if (!product) {
        return res.status(404).json({
          status: "Not found",
          message: "Product not found",
          status_code: 404,
        });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        status: "An unexpected error occurred",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }

  /**
   * @swagger
   * /api/v1/products/{product_id}:
   *   put:
   *     summary: Update a product by its ID
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: integer
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
   *                 example: Updated Product Name
   *               description:
   *                 type: string
   *                 example: Updated description of the product
   *               price:
   *                 type: number
   *                 example: 20
   *               category:
   *                 type: string
   *                 example: Electronics
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Success
   *                 message:
   *                   type: string
   *                   example: Product updated successfully
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 123
   *                     name:
   *                       type: string
   *                       example: Updated Product Name
   *                     description:
   *                       type: string
   *                       example: Updated description of the product
   *                     price:
   *                       type: number
   *                       example: 20
   *                     category:
   *                       type: string
   *                       example: Electronics
   *       400:
   *         description: Bad request due to invalid product ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Bad Request
   *                 message:
   *                   type: string
   *                   example: Invalid Product Id
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Not Found
   *                 message:
   *                   type: string
   *                   example: Product not found
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: An unexpected error occurred
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */

  async updateProductById(req: Request, res: Response) {
    const productId = req.params.product_id;
    const productData = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Invalid Product Id",
        status_code: 400,
      });
    }

    try {
      const updatedProduct = await this.productService.updateProductById(
        productId,
        productData,
      );
      if (!updatedProduct) {
        return res.status(404).json({
          status: "Not found",
          message: "Product not found",
          status_code: 404,
        });
      }
      return res.status(200).json({
        status: "Success",
        message: "Product updated successfully",
        status_code: 200,
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: "An unexpected error occurred",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }

  /**
   * @swagger
   * /api/v1/products/{product_id}:
   *   delete:
   *     summary: Delete a product by its ID
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the product to delete
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Product deleted successfully
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *       400:
   *         description: Bad request due to invalid product ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Bad Request
   *                 message:
   *                   type: string
   *                   example: Invalid Product Id
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Not Found
   *                 message:
   *                   type: string
   *                   example: Product not found
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: An unexpected error occurred
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */

  async deleteProduct(req: Request, res: Response) {
    const productId = req.params.product_id;

    if (!productId) {
      res.status(400).json({
        status: "Bad Request",
        message: "Invalid Product Id",
        status_code: 400,
      });
    }
    try {
      const deleted = await this.productService.deleteProductById(productId);

      if (!deleted) {
        return res.status(404).json({
          status: "Not Found",
          message: "Product not found",
          status_code: 404,
        });
      }

      return res.status(200).json({
        message: "Product deleted successfully",
        status_code: 200,
      });
    } catch (error) {
      return res.status(500).json({
        status: "An unexpected error occured",
        message: "Internal server error",
        status_code: 500,
      });
    }
  }

  /**
   * @swagger
   * /api/v1/products/:org_id:
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
   *               quantity:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Product created successfully
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
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: Product created successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     description:
   *                       type: string
   *                     price:
   *                       type: number
   *                     quantity:
   *                       type: integer
   *                     category:
   *                       type: string
   *                     id:
   *                       type: string
   *       401:
   *         description: Unauthorized user | Invalid product detail | Invalid token
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: unsuccessful
   *                     status_code:
   *                       type: integer
   *                       example: 401
   *                     message:
   *                       type: string
   *                       example: Validation error
   *                     errors:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           property:
   *                             type: string
   *                           constraints:
   *                             type: object
   *                 - type: object
   *                   properties:
   *                     status_code:
   *                       type: string
   *                       example: "401"
   *                     message:
   *                       type: string
   *                       example: Invalid token
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
   *                   type: integer
   *                 message:
   *                   type: string
   */
  async createProduct(req: Request, res: Response) {
    try {
      const { user } = req;
      const { org_id } = req.params;
      const sanitizedData = req.body;

      if (!user) {
        return res.status(401).json({
          status: "unsuccessful",
          status_code: 401,
          message: "Unauthorized User",
        });
      }

      if (!org_id) {
        return res.status(401).json({
          status: "unsuccessful",
          status_code: 401,
          message: "org_id not found",
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
        data: productWithoutUser,
      });
    } catch (error) {
      // Check if the error is an array of ValidationError
      if (
        Array.isArray(error) &&
        error.every((err) => err instanceof ValidationError)
      ) {
        const constraints = error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));

        return res.status(401).json({
          status: "unsuccessful",
          status_code: 401,
          message: "Validation error",
          errors: constraints,
        });
      }

      return res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default ProductController;
