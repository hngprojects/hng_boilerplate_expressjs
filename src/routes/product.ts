import express from "express";
import ProductController from "../controllers/ProductController";
import { authMiddleware } from "../middleware";
import { validateProductDetails } from "../middleware/product";
const productRouter = express.Router();
const productController = new ProductController();
// modified because the base route changed to "/api/v1"
productRouter.get(
  "/products",
  authMiddleware,
  productController.getProductPagination.bind(productController),
);
// modified because the base route changed to "/api/v1"
productRouter.put(
  "/products/:product_id",
  authMiddleware,
  productController.updateProductById.bind(productController),
);
// modified because the base route changed to "/api/v1"
productRouter.delete(
  "/products/:product_id",
  authMiddleware,
  productController.deleteProduct.bind(productController),
);
// modified because the base route changed to "/api/v1"
productRouter.get(
  "/products/:product_id",
  authMiddleware,
  productController.fetchProductById.bind(productController),
);

productRouter
  .route("/products")
  .post(
    validateProductDetails,
    authMiddleware,
    productController.createProduct.bind(productController),
  );
export { productRouter };
