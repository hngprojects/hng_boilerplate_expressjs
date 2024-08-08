import { Request, Response } from "express";
import { JobService } from "../services/job.service";
import { HttpError } from "../middleware";
import AppDataSource from "../data-source";

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

  async getAllJobs(req: Request, res: Response) {
    try {
      const billing = await this.jobService.getAllJobs(req);
      res.status(201).json({ message: "Success", billing });
    } catch (error) {
      res.status(500).json({ message: error.message });

  /**
   * @swagger
   * /jobs/{jobId}:
   *   delete:
   *     summary: Delete a job by its ID
   *     description: Deletes a specific job listing by its unique ID.
   *     tags:
   *       - Jobs
   *     parameters:
   *       - in: path
   *         name: jobId
   *         required: true
   *         description: The ID of the job to delete.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Job listing deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Job listing deleted successfully"
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: object
   *                   description: The deleted job object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "abc123"
   *                     title:
   *                       type: string
   *                       example: "Software Engineer"
   *                     description:
   *                       type: string
   *                       example: "Develop and maintain software applications."
   *                     // Add other job properties as needed
   *       404:
   *         description: Job not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Job not found"
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       422:
   *         description: Validation failed: Valid job ID required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Validation failed: Valid job ID required"
   *                 status_code:
   *                   type: integer
   *                   example: 422
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Internal server error"
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */

  async deleteJob(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      if (!jobId) {
        throw new HttpError(422, "Validation failed: Valid job ID required");
      }

      const deletedJob = await this.jobService.delete(jobId);
      res.status(200).json({
        message: "Job listing deleted successfully",
        status_code: 200,
        data: deletedJob,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error", status_code: 500 });
      }
    }
  }
}
