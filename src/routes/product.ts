import express from 'express';
import { ProductController } from '../controllers';
import { authMiddleware } from '../middleware';

const productRouter = express.Router();
const productController = new ProductController();

productRouter.delete('/delete/:id',authMiddleware /*add authorization middleware*/ , productController.deleteProduct);

export { productRouter };