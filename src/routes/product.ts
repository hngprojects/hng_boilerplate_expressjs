import express from "express";
import ProductController from "../controllers/ProductController";
import { authMiddleware } from "../middleware";
import { validateProductDetails } from "../middleware/product";
const productRouter = express.Router();
const productController = new ProductController();



productRouter.get(
	"/",
	authMiddleware,
	productController.getProductPagination.bind(productController)
);

productRouter.put(
	"/:product_id",
	authMiddleware,
	productController.updateProductById.bind(productController)
);

productRouter.delete(
	"/:product_id",
	authMiddleware,
	productController.deleteProduct.bind(productController)
);

productRouter.get(
	"/:product_id",
	authMiddleware,
	productController.fetchProductById.bind(productController)
);

productRouter
	.route("/")
	.post(
		validateProductDetails,
		authMiddleware,
		productController.createProduct.bind(productController)
	);
export { productRouter };
