import express from 'express';
import { ProductController } from '../controllers';
import { authMiddleware } from '../middleware';

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get(
  '/products',
  authMiddleware,
  productController.listProducts.bind(productController)
);

export { productRouter };
