import {
  createTopicSchema,
  updateTopicSchema,
  deleteTopicSchema,
  getTopicSchema,
} from "../schemas/help-center";
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
  validateData(createTopicSchema),
  createTopic,
);

helpRoute.patch(
  "/help-center/topics/:id",
  validateData(updateTopicSchema),
  updateTopic,
);

helpRoute.get("/help-center/topics", getAllTopics);

helpRoute.get("/help-center/topics/:id", getTopicById);

helpRoute.delete("/help-center/topics/:id", deleteTopic);

export { helpRoute };
