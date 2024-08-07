import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middleware";
import { validateProductDetails } from "../middleware/product";
import { validateUserToOrg } from "../middleware/organization.validation";
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

export { productRouter };
