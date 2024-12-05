import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware, validOrgAdmin } from "../middleware";
import { validateUserToOrg } from "../middleware/organizationValidation";
import { requestBodyValidator } from "../middleware/request-validation";
import { productSchema } from "../schema/product.schema";

const productRouter = Router();
const productController = new ProductController();

productRouter.post(
  "/organizations/:org_id/products",
  requestBodyValidator(productSchema),
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
  "/organisations/:org_id/products/:product_id",
  authMiddleware,
  validOrgAdmin,
  productController.deleteProduct,
);

productRouter.get(
  "/organisations/:org_id/products/:product_id",
  authMiddleware,
  validOrgAdmin,
  productController.getSingleProduct,
);

export { productRouter };
