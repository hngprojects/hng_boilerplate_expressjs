import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middleware";
import { validateProductDetails } from "../middleware/product";
import { validateUserToOrg } from "../middleware/organization.validation";
import { adminOnly } from "../middleware";

console.log("ProductController:", ProductController);
console.log("authMiddleware:", authMiddleware);

const productRouter = Router();
const productController = new ProductController();

productRouter.post(
  "/organizations/:id/products",
  validateProductDetails,
  authMiddleware,
  adminOnly,
  validateUserToOrg,
  productController.createProduct,
);

productRouter.get(
  "/organizations/:id/products/search",
  authMiddleware,
  validateUserToOrg,
  productController.getProduct,
);

productRouter.delete(
  "/organizations/:org_id/products/product_id",
  adminOnly,
  validateUserToOrg,
  authMiddleware,
);

export { productRouter };
