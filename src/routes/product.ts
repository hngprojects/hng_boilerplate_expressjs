import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const productRoute = Router();

const productController = new ProductController();
productRoute.get(
  '/products',
  productController.listProducts.bind(productController)
);

export { productRoute };
