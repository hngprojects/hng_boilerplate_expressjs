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

// Add a route to get a job by id
jobRoute.get(
  "/jobs/:jobId",
  authMiddleware,
  jobController.getJobById.bind(jobController),
)

export { jobRoute };
