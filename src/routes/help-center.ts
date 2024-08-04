import { createTopicSchema, updateTopicSchema } from "../schemas/help-center";
import { validateData } from "../middleware/validationMiddleware";
import {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
} from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const helpRoute = Router();

helpRoute.post(
  "/help-center/topics",
  authMiddleware,
  validateData(createTopicSchema),
  createTopic,
);

helpRoute.patch(
  "/help-center/topics/:id",
  authMiddleware,
  validateData(updateTopicSchema),
  updateTopic,
);

helpRoute.get("/help-center/topics", authMiddleware, getAllTopics);

helpRoute.get("/help-center/topics/:id", authMiddleware, getTopicById);

helpRoute.delete("/help-center/topics/:id", authMiddleware, deleteTopic);

export { helpRoute };
