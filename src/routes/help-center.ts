// src/routes/help-center.ts
import { Router } from "express";
import HelpController from "../controllers/HelpController";
import { authMiddleware } from "../middleware/auth";
import { verifyAdmin } from "../services";

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
  verifyAdmin,
  helpController.updateTopic.bind(helpController),
);
helpRouter.get(
  "/topics",
  authMiddleware,
  helpController.getAllTopics.bind(helpController),
);
helpRouter.get(
  "/topics/:id",
  authMiddleware,
  helpController.getTopicById.bind(helpController),
);
helpRouter.delete(
  "/topics/:id",
  authMiddleware,
  helpController.deleteTopic.bind(helpController),
);
export { helpRouter };
