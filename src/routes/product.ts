import express from 'express';
import { ProductController } from '../controllers';
import { authMiddleware } from '../middleware';

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get(
  '/',
  // authMiddleware,
  productController.listProducts.bind(productController)
);

// update product
productRouter.put(
  '/:product_id',
  // authMiddleware,
  productController.updateProduct.bind(productController)
);

export { productRouter };
