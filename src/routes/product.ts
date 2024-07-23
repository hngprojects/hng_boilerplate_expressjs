import express from 'express';
import ProductController from '../controllers/ProductController';
import { authMiddleware } from '../middleware';

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get(
  '/',
  authMiddleware,
  productController.getProductPagination.bind(productController)
);

export { productRouter };
