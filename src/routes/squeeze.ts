import { Router } from "express";
import { SqueezeController } from "../controllers";
import { squeezeSchema } from "../schemas/squeeze";
import { validateData } from "../middleware/validationMiddleware";

const squeezeRoute = Router();
const updateSchema = squeezeSchema.partial();
const squeezecontroller = new SqueezeController();

squeezeRoute.post(
  "/squeeze",
  validateData({ body: squeezeSchema }),
  squeezecontroller.createSqueeze,
);

squeezeRoute.put(
  "/squeeze/:email",
  validateData({ body: updateSchema }),
  squeezecontroller.updateSqueeze,
);

export { squeezeRoute };
