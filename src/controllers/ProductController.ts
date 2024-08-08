import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.services";

class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @openapi
   * tags:
   *   - name: Product API
   *     description: Product API related routes
   */

  /**
   * @openapi
   * /api/v1/organisation/{:id}/product:
   *   post:
   *     tags:
   *       - Product API
   *     summary: Create a new product
   *     description: Create a new product for organisations.
   *     parameters:
   *       - name: org_id
   *         in: path
   *         required: true
   *         description: ID of the organisation
   *         schema:
   *           type: string
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
   *               category:
   *                 type: string
   *               price:
   *                 type: number
   *               quantity:
   *                 type: number
   *               image:
   *                 type: string
   *               is_deleted:
   *                 type: boolean
   *             required:
   *               - name
   *               - price
   *               - quantity
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
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Product created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     description:
   *                       type: string
   *                     price:
   *                       type: number
   *                     status:
   *                       type: string
   *                     is_deleted:
   *                       type: boolean
   *                     quantity:
   *                       type: number
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Invalid input or missing organisation ID
   *       409:
   *         description: Server error
   */
  public createProduct = async (req: Request, res: Response) => {
    const id = req.params.org_id;
    const product = req.body;
    const newProduct = await this.productService.createProduct(id, product);
    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  };

  /**
   * @openapi
   * /api/v1/products/{product_id}:
   *   delete:
   *     summary: Delete a product by its ID
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization
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

  public deleteProduct = async (req: Request, res: Response) => {
    const { org_id, product_id } = req.params;
    await this.productService.deleteProduct(org_id, product_id);
    res.status(200).json({ message: "Product deleted successfully" });
  };

  /**
   * @swagger
   * /api/v1/{org_id}/products/{product_id}:
   *   put:
   *     summary: Update a product
   *     description: Update details of a product within an organization.
   *     tags:
   *       - Products
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *                 example: "product 1 updated price"
   *               price:
   *                 type: number
   *                 example: 30
   *               name:
   *                 type: string
   *               category:
   *                 type: string
   *               quantity:
   *                 type: integer
   *               image:
   *                 type: string
   *               size:
   *                 type: string
   *               stock_status:
   *                 type: string
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
   *                   example: "success"
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "product update successful"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "b14e4406-80f6-4029-9681-715798741c8f"
   *                     name:
   *                       type: string
   *                       example: "Product 1"
   *                     description:
   *                       type: string
   *                       example: "product 1 updated price"
   *                     price:
   *                       type: number
   *                       example: 30
   *                     quantity:
   *                       type: integer
   *                       example: 1
   *                     category:
   *                       type: string
   *                       example: "test product"
   *                     image:
   *                       type: string
   *                       example: "image url"
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-08-08T09:06:36.210Z"
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-08-08T07:12:33.936Z"
   *                     size:
   *                       type: string
   *                       example: "Standard"
   *                     stock_status:
   *                       type: string
   *                       example: "low on stock"
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: "user not a member of organization"
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 403
   *                 message:
   *                   type: string
   *                   example: "Forbidden: User not an admin or super admin"
   *       404:
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "Product with id b14e4406-80f6-4029-9681-715798741c8f not found"
   *       422:
   *         description: Unprocessable Entity
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 422
   *                 message:
   *                   type: string
   *                   example: "Product ID not provided"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: "Internal server error"
   */

  public updateProduct = async (req: Request, res: Response) => {
    const { org_id, product_id } = req.params;
    const updatedProduct = await this.productService.updateProduct(
      org_id,
      product_id,
      req.body,
    );
    res.status(200).json({
      status_code: 200,
      message: "product update successful",
      data: updatedProduct,
    });
  };
}

export { ProductController };
