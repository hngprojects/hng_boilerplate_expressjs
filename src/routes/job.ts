import Router from "express";
import { JobListingController } from "../controllers/JobListingController";

const jobListingRouter = Router();
const jobListingController = new JobListingController();

jobListingRouter.get(
  "/job-listings",
  jobListingController.getAllJobListings.bind(jobListingController)
);
export { jobListingRouter };