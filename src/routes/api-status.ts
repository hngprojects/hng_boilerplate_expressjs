import { Router } from "express";
import { createApiStatus } from "../controllers/api-status.controller";

const apiStatusRouter = Router();

apiStatusRouter.post("/api-status", createApiStatus);

export { apiStatusRouter };
