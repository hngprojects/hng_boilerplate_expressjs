import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get('/products/categories', categoryController.getAllCategories.bind(categoryController));
categoryRouter.post('/products/categories', categoryController.createCategory.bind(categoryController));

export default categoryRouter;
