import { Router } from "express";
import { SqueezeController } from "../controllers";
import { authMiddleware } from "../middleware";

const squeezeRoute = Router();
const squeezecontroller = new SqueezeController();

squeezeRoute.post(
  "/squeeze-pages",
  authMiddleware,
  squeezecontroller.createSqueeze.bind(squeezecontroller),
);

export { squeezeRoute };