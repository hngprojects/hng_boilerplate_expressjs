import { Router } from "express";
import { JobController } from "../controllers/jobController";
import { authMiddleware } from "../middleware";

const jobRouter = Router();

const jobController = new JobController();

jobRouter.post(
  "/jobs",
  authMiddleware,
  jobController.createJob.bind(jobController),
);

export { jobRouter };
