import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware, validOrgAdmin } from "../middleware";
import { validateProductDetails } from "../middleware/product";
import { validateUserToOrg } from "../middleware/organizationValidation";
import { adminOnly } from "../middleware";

const productRouter = Router();
const productController = new ProductController();

// route
productRouter.post(
  "/organizations/:org_id/products",
  validateProductDetails,
  authMiddleware,
  validOrgAdmin,
  productController.createProduct,
);

productRouter.get(
  "/organizations/:org_id/products/search",
  authMiddleware,
  validateUserToOrg,
  productController.getProduct,
);

productRouter.delete(
  "/organizations/:org_id/products/:product_id",
  authMiddleware,
  validOrgAdmin,
  productController.deleteProduct,
);

productRouter.get(
  "/organizations/:org_id/products/:product_id",
  authMiddleware,
  validOrgAdmin,
  productController.getSingleProduct,
);

export { productRouter };
