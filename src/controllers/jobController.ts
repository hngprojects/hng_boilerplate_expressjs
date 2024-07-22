import { Request, Response } from "express";
import { JobService } from "../services/job.service";

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  async createJob(req: Request, res: Response) {
    try {
      const job = await this.jobService.create(req);
      res.json({
        message: "Job listing created successfully",
        status_code: 201,
        data: job,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status_code: 400 });
    }
  }
}
