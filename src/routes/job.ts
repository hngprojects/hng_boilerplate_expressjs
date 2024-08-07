import { Router } from "express";
import { JobController } from "../controllers/jobController";
import { authMiddleware, validateData } from "../middleware";
import { createJobSchema } from "../schemas/job";

const jobRoute = Router();

const jobController = new JobController();

jobRoute.post(
  "/jobs",
  validateData({ body: createJobSchema }),
  authMiddleware,
  jobController.createJob.bind(jobController),
);

jobRoute.get("/jobs", jobController.getAllJobs.bind(jobController));

// Add a route to get a job by id
jobRoute.get(
  "/jobs/:jobId",
  authMiddleware,
  jobController.getJobById.bind(jobController),
)

export { jobRoute };
