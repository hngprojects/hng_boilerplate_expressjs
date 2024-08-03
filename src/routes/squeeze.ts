import { Router } from "express";
import { SqueezeController } from "../controllers";
import { squeezeSchema } from "../schemas/squeeze";
import { validateData } from "../middleware/validationMiddleware";

const squeezeRoute = Router();
const updateSchema = squeezeSchema.partial();

squeezeRoute.post(
  "/squeeze",
  validateData(squeezeSchema),
  SqueezeController.createSqueeze,
);

squeezeRoute.put(
  "/squeeze/:email",
  validateData(updateSchema),
  SqueezeController.updateSqueeze,
);

export { squeezeRoute };
