import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authMiddleware, validateData } from "../middleware";
import { productSchema } from "../schemas/product";

console.log("ProductController:", ProductController);
console.log("authMiddleware:", authMiddleware);

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
export { productRouter };
