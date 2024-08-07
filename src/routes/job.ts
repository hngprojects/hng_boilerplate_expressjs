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

export { jobRoute };
