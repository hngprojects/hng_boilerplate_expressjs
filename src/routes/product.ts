import express from 'express';
import ProductController from '../controllers/ProductController';
import { authMiddleware } from '../middleware';

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
  '/',
  authMiddleware,
  productController.getProductPagination.bind(productController)
);

export { productRouter };
