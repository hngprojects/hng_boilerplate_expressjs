import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authMiddleware } from "../middleware";

console.log("ProductController:", ProductController);
console.log("authMiddleware:", authMiddleware);

const productRouter = Router();
const productController = new ProductController();

productRouter.post(
  "/organizations/:id/products",
  authMiddleware,
  productController.createProduct,
);
productRouter.get(
  "/organizations/:id/products/search",
  authMiddleware,
  productController.searchProduct,
);

export { productRouter };
