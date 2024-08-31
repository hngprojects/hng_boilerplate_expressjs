import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware, checkPermissions, validOrgAdmin } from "../middleware";
import { validateProductDetails } from "../middleware/product";
import { validateUserToOrg } from "../middleware/organizationValidation";

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
productRouter.patch(
  "/organisations/:orgId/products/:productId",
  authMiddleware,
  productController.updateProduct,
);
export { productRouter };
