import { Router } from "express";
import exportController from "../controllers/exportController";
import { authMiddleware } from "../middleware";

const exportRouter = Router();

exportRouter.get("/export-data", authMiddleware, exportController.exportData);

export { exportRouter };
