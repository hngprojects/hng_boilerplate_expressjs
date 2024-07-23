import express from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middleware";

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get(
  "/products",
  authMiddleware,
  productController.listProducts.bind(productController)
);

productRouter.get(
  "/product/:id",
  authMiddleware,
  productController.getSpecificProduct
);
export { productRouter };
