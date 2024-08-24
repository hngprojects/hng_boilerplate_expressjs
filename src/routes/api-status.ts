import { Router } from "express";
import {
  createApiStatus,
  getApiStatus,
} from "../controllers/api-status.controller";

const apiStatusRouter = Router();

apiStatusRouter.post("/api-status", createApiStatus);
apiStatusRouter.get("/api-status", getApiStatus);

export { apiStatusRouter };
