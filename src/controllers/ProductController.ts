import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import { User } from '../models';
import { ResourceNotFound } from '../middleware/error';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export class ProductController {
  public async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      //   const userId = (req.user as User).id;
      const product = await Product.findOne({ where: { id } });

      if (!product) {
        throw new ResourceNotFound('Product not found or you do not have permission to delete it');
      }

      await product.remove();

      res.status(200).json({
        message: 'Product deleted successfully',
        status_code: 200
      });
    } catch (error) {
      next(error);
    }
  }
}

/**
 * @swagger
 * /api/v1/delete/{id}:
 *   delete:
 *     summary: Deletes a product
 *     description: Deletes a single product based on the ID provided. Only accessible by authenticated users.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
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
 *       404:
 *         description: Product not found or you do not have permission to delete it.
 *       401:
 *         description: Unauthorized. You need to be authenticated to perform this action.
 *     security:
 *       - bearerAuth: []
 */