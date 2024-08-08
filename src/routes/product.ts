import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middleware";
import { validateProductDetails } from "../middleware/product";
import { validateUserToOrg } from "../middleware/organizationValidation";
import { adminOnly } from "../middleware";

const productRouter = Router();
const productController = new ProductController();

productRouter.post(
  "/organizations/:org_id/products",
  validateProductDetails,
  authMiddleware,
  adminOnly,
  validateUserToOrg,
  productController.createProduct,
);

productRouter.delete(
  "/organizations/:org_id/products/:product_id",
  authMiddleware,
  adminOnly,
  validateUserToOrg,
  productController.deleteProduct,
);

export { productRouter };
