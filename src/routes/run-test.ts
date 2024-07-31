import { Router, Response, Request } from "express";
import { runTestController } from "../controllers";

const runTestRouter = Router();

runTestRouter.get("/run-test", runTestController);

export { runTestRouter };
