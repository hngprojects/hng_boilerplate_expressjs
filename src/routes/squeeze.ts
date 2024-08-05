import { Router } from "express";
import { SqueezeController } from "../controllers";
import { squeezeSchema } from "../schemas/squeeze";
import { validateData } from "../middleware/validationMiddleware";

const squeezeRoute = Router();
const updateSchema = squeezeSchema.partial();

squeezeRoute.post(
  "/squeeze",
  validateData({ body: squeezeSchema }),
  SqueezeController.createSqueeze,
);

squeezeRoute.put(
  "/squeeze/:email",
  validateData({ body: updateSchema }),
  SqueezeController.updateSqueeze,
);

export { squeezeRoute };
