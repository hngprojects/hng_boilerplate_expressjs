import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authMiddleware, validateData } from "../middleware";
import { productSchema } from "../schemas/product";

const productRouter = Router();
const productController = new ProductController();

productRouter.post(
  "/organizations/:id/products",
  authMiddleware,
  productController.createProduct,
);

const updateRoute = "/organizations/:org_id/products/:product_id";
productRouter
  .route(updateRoute)
  .patch(
    authMiddleware,
    validateData({ body: productSchema }),
    productController.updateProduct,
  );

productRouter.get(
  "/organizations/:id/products/search",
  authMiddleware,
  productController.getProduct,
);

export { productRouter };
