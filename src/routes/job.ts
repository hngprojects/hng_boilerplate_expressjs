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
jobRouter.delete(
  "/jobs/:jobId",
  authMiddleware,
  jobController.deleteJob.bind(jobController),
);

jobRouter.get(
  "/jobs",
  jobController.getAllJobs.bind(jobController),
);

export { jobRouter };
