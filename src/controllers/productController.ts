import { Request, Response } from "express";
import { ProductService } from "../services/product";
import asyncHandler from "../middleware/asyncHandler";

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
   * components:
   *   securitySchemes:
   *     BearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   *   schemas:
   *     ProductResponse:
   *       type: object
   *       properties:
   *         status:
   *           type: string
   *           example: "success"
   *         message:
   *           type: string
   *           example: "Product created successfully"
   *         data:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             name:
   *               type: string
   *             description:
   *               type: string
   *             price:
   *               type: number
   *             status:
   *               type: string
   *             is_deleted:
   *               type: boolean
   *             quantity:
   *               type: number
   *             created_at:
   *               type: string
   *               format: date-time
   *             updated_at:
   *               type: string
   *               format: date-time
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

  public createProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.org_id;
    const product = req.body;
    const newProduct = await this.productService.createProduct(id, product);
    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  });

  /**
   * @swagger
   * /organizations/:org_id/products/:product_id:
   *   patch:
   *     summary: Updates an existing product
   *     tags: [Product, Update Product]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the organization for which the product will be updated
   *       - in: path
   *         name: product_id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the product to be updated
   *     requestBody:
   *       description: Product data to update
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
   *                 type: number
   *     responses:
   *       200:
   *         description: Product update successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProductResponse'
   *       400:
   *         description: Invalid format
   *       409:
   *         description: Organization Or Product ID not provided
   *       404:
   *         description: Organization Or Product not found
   *       500:
   *         description: Internal server error
   *     security:
   *       - bearerAuth: []
   */

  public updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { product_id, org_id } = req.params;
    const updatedProduct = await this.productService.updateProduct(
      org_id,
      product_id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      status_code: 200,
      message: "product update successful",
      data: updatedProduct,
    });
  });

  /*
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

  public getProduct = asyncHandler(async (req: Request, res: Response) => {
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
    res
      .status(200)
      .json({ message: "Product search successful", data: products });
  });
}

export { ProductController };
