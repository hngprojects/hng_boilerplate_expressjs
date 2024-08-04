import { Router } from "express";
import { JobController } from "../controllers/jobController";
import { authMiddleware } from "../middleware";

const jobRoute = Router();

const jobController = new JobController();

jobRoute.post(
  "/jobs",
  authMiddleware,
  jobController.createJob.bind(jobController),
);

export { jobRoute };
