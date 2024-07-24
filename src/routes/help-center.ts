// src/routes/help-center.ts
import { Router } from "express";
import HelpController from "../controllers/HelpController";
import { authMiddleware } from "../middleware/auth";

const helpRouter = Router();
const helpController = new HelpController();
helpRouter.post(
  "/topics",
  authMiddleware,
  helpController.createTopic.bind(helpController),
);
helpRouter.patch(
  "/topics/:id",
  authMiddleware,
  helpController.updateTopic.bind(helpController),
);
export { helpRouter };
