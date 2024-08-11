import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.services";
import { BadRequest } from "../middleware";

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
   * /api/v1/organizations/{org_id}/product:
   *   post:
   *     summary: Create a product
   *     tags: [Product]
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
   * /api/v1/organisation/{:id}/product/search:
   *   get:
   *     tags:
   *       - Product API
   *     summary: Get All products.
   *     description: Get All products within an organisation.
   *     parameters:
   *       - name: org_id
   *         in: path
   *         required: true
   *         description: ID of the organisation
   *         schema:
   *           type: string
   *       - name: name
   *         in: query
   *         required: false
   *         description: Name of the product
   *         schema:
   *           type: string
   *       - name: category
   *         in: query
   *         required: false
   *         description: Category of the product
   *         schema:
   *           type: string
   *       - name: minPrice
   *         in: query
   *         required: false
   *         description: Minimum price of the product
   *         schema:
   *           type: number
   *       - name: maxPrice
   *         in: query
   *         required: false
   *         description: Maximum price of the product
   *         schema:
   *           type: number
   *       - name: page
   *         in: query
   *         required: false
   *         description: Page number for pagination
   *         schema:
   *           type: number
   *           default: 1
   *       - name: limit
   *         in: query
   *         required: false
   *         description: Number of results per page
   *         schema:
   *           type: number
   *           default: 10
   *     responses:
   *       200:
   *         description: Product search successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Product search successful"
   *                 data:
   *                   type: object
   *                   properties:
   *                     pagination:
   *                       type: object
   *                       properties:
   *                         total:
   *                           type: number
   *                         page:
   *                           type: number
   *                         limit:
   *                           type: number
   *                         totalPages:
   *                           type: number
   *                     products:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           name:
   *                             type: string
   *                           description:
   *                             type: string
   *                           price:
   *                             type: number
   *                           category:
   *                             type: string
   *                           status:
   *                             type: string
   *                           quantity:
   *                             type: number
   *                           created_at:
   *                             type: string
   *                             format: date-time
   *                           updated_at:
   *                             type: string
   *                             format: date-time
   *       400:
   *         description: Invalid input or missing organisation ID
   *       404:
   *         description: No products found
   */

  public getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orgId = req.params.org_id;
      const {
        name,
        category,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
      } = req.query as any;
      const searchCriteria = {
        name,
        category,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
      };

      const products = await this.productService.getProducts(
        orgId,
        searchCriteria,
        Number(page),
        Number(limit),
      );
      return res
        .status(200)
        .json({ message: "Product search successful", data: products });
    } catch (error) {
      next(error);
    }
  };

  public getAllProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 10 } = req.query as any;

      const products = await this.productService.getAllProducts(
        Number(page),
        Number(limit),
      );
      return res.status(200).json({
        status_code: 200,
        message: "Product retrieved successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /api/v1/organizations/{org_id}/products/{product_id}:
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

  public deleteProduct = async (req: Request, res: Response) => {
    const { org_id, product_id } = req.params;
    await this.productService.deleteProduct(org_id, product_id);
    res.status(200).json({ message: "Product deleted successfully" });
  };

  /**
   * @openapi
   * /api/v1/organizations/{org_id}/products/{product_id}:
   *   get:
   *     summary: get a product by its ID
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the product to get
   *     responses:
   *       200:
   *         description: Product retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Product retrieved successfully
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
   *                     quantity:
   *                       type: number
   *                     category:
   *                       type: string
   *                     image:
   *                       type: string
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                     size:
   *                       type: string
   *                     stock_status:
   *                       type: string
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

  public getSingleProduct = async (req: Request, res: Response) => {
    const { org_id, product_id } = req.params;
    if (product_id && org_id) {
      const product = await this.productService.getProduct(org_id, product_id);
      if (product) {
        res.status(200).json({
          status_code: 200,
          message: "Product retrieved successfully",
          data: product,
        });
      }
    } else {
      return new BadRequest("Invalid Product ID");
    }
  };
}

export { ProductController };
