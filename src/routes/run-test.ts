import { Router } from "express";
import { runTestController } from "../controllers";

const runTestRouter = Router();

runTestRouter.get("/run-tests", runTestController);

export { runTestRouter };
