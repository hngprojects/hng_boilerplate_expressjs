import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

const productController = new ProductController();

// Define routes for products
router.post("/organizations/:id/products", productController.createProduct);

export default router;
