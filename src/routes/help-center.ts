// src/routes/help-center.ts
import { Router } from "express";
import HelpController from "../controllers/HelpController";
import { authMiddleware } from "../middleware/auth";
import { verifyAdmin } from "../services";

const helpRouter = Router();
const helpController = new HelpController();
helpRouter.post(
  "/help-center/topics",
  authMiddleware,
  helpController.createTopic.bind(helpController),
);
helpRouter.patch(
  "/help-center/topics/:id",
  authMiddleware,
  verifyAdmin,
  helpController.updateTopic.bind(helpController),
);
helpRouter.get(
  "/help-center/topics",
  authMiddleware,
  helpController.getAllTopics.bind(helpController),
);
helpRouter.get(
  "/help-center/topics/:id",
  authMiddleware,
  helpController.getTopicById.bind(helpController),
);
helpRouter.delete(
  "/help-center/topics/:id",
  authMiddleware,
  helpController.deleteTopic.bind(helpController),
);
export { helpRouter };
