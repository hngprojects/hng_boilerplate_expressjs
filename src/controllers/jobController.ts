import { NextFunction, Request, Response } from "express";
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

  /**
   * @swagger
   * /api/v1/jobs/{jobId}:
   *   get:
   *     summary: Get job details by ID
   *     description: Retrieve the details of a job by its unique identifier.
   *     tags: [Jobs]
   *     parameters:
   *       - in: path
   *         name: jobId
   *         required: true
   *         schema:
   *           type: string
   *         description: The unique identifier of the job.
   *     responses:
   *       200:
   *         description: Successfully retrieved job details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 title:
   *                   type: string
   *                   example: "Software Engineer"
   *                 description:
   *                   type: string
   *                   example: "Job description here..."
   *                 company_name:
   *                   type: string
   *                   example: "Company Name"
   *                 location:
   *                   type: string
   *                   example: "Remote"
   *                 salary:
   *                   type: number
   *                   example: 60000
   *                 job_type:
   *                   type: string
   *                   example: Backend Devloper
   *       404:
   *         description: Job not found.
   *       400:
   *         description: Invalid job ID format.
   *       500:
   *         description: Internal server error.
   */
  public async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;

      const job = await this.jobService.getById(jobId);
      if (!job) {
        return res.status(404).json({
          status_code: 404,
          success: false,
          message: "Job not found",
        });
      }

      res.status(200).json({
        status_code: 200,
        success: true,
        message: "The Job is retrieved successfully.",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }
}
