import { Router } from "express";
import { runTestController } from "../controllers";

const runTestRouter = Router();

runTestRouter.get("/", runTestController);

export { runTestRouter };
