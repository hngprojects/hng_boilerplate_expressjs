import express from "express";
import ProductController from "../controllers/ProductController";
import { authMiddleware } from "../middleware";

const productRouter = express.Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: API for products management.
 */

/**
 * @swagger
 * /api/v1/products/:
 *  get:
 *    summary: Get paginated products
 *    tags: [Products]
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Page number
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: Number of items per page
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                status_code:
 *                  type: integer
 *                data:
 *                  type: object
 *                  properties:
 *                    page:
 *                      type: integer
 *                    limit:
 *                      type: integer
 *                    totalProducts:
 *                      type: integer
 *                    products:
 *                      type: array
 *                      items:
 *                        $ref: '#/models/product'
 *      400:
 *        description: Invalid query parameters
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                message:
 *                  type: string
 *                status_code:
 *                  type: integer
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                message:
 *                  type: string
 *                status_code:
 *                  type: integer
 */

productRouter.get(
	"/",
	authMiddleware,
	productController.getProductPagination.bind(productController)
);
productRouter.get(
	"/:product_id",
	authMiddleware,
	productController.fetchProductById.bind(productController)
);

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
productRouter.delete(
	"/:product_id",
	authMiddleware,
	productController.deleteProduct.bind(productController)
);
export { productRouter };
