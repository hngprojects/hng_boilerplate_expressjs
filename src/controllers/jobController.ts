import { Request, Response } from "express";
import { JobService } from "../services/jobservice";
import { validateCreateJob } from "../validationschema/job";

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  /**
   * @swagger
   * /api/v1/jobs:
   *   post:
   *     summary: Create a new job listing
   *     description: Create a new job listing with the provided details
   *     tags: [Jobs]
   *     consumes:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: Software Engineer
   *               description:
   *                 type: string
   *                 example: This is a job description
   *               location:
   *                 type: string
   *                 example: Remote
   *               deadline:
   *                 type: string
   *                 format: date-time
   *                 example: 2023-07-21T19:58:00.000Z
   *               salary_range:
   *                 type: string
   *                 enum: [below_30k, 30k_to_50k, 50k_to_70k, 70k_to_100k, 100k_to_150k, above_150k]
   *                 example: 50k_to_70k
   *               job_type:
   *                 type: string
   *                 enum: [full-time, part-time, internship, contract]
   *                 example: full-time
   *               job_mode:
   *                 type: string
   *                 enum: [remote, onsite]
   *                 example: remote
   *               company_name:
   *                 type: string
   *                 example: ABC Company
   *           example:
   *             title: Software Engineer
   *             description: This is a job description
   *             location: Remote
   *             deadline: 2023-07-21T19:58:00.000Z
   *             salary_range: 50k_to_70k
   *             job_type: full-time
   *             job_mode: remote
   *             company_name: ABC Company
   *     parameters:
   *       - in: body
   *         name: job
   *         description: Job details
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               type: string
   *               example: Software Engineer
   *             description:
   *               type: string
   *               example: This is a job description
   *             location:
   *               type: string
   *               example: Remote
   *             deadline:
   *               type: string
   *               format: date-time
   *               example: 2023-07-21T19:58:00.000Z
   *             salary_range:
   *               type: string
   *               enum: [below_30k, 30k_to_50k, 50k_to_70k, 70k_to_100k, 100k_to_150k, above_150k]
   *               example: 50k_to_70k
   *             job_type:
   *               type: string
   *               enum: [full-time, part-time, internship, contract]
   *               example: full-time
   *             job_mode:
   *               type: string
   *               enum: [remote, onsite]
   *               example: remote
   *             company_name:
   *               type: string
   *               example: ABC Company
   *         required:
   *           - title
   *           - description
   *           - location
   *           - deadline
   *           - salary_range
   *           - job_type
   *           - job_mode
   *           - company_name
   *     responses:
   *       201:
   *         description: Job listing created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: Job listing created successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: 123e4567-e89b-12d3-a456-426614174000
   *                     title:
   *                       type: string
   *                       example: Software Engineer
   *                     description:
   *                       type: string
   *                       example: This is a job description
   *                     location:
   *                       type: string
   *                       example: Remote
   *                     deadline:
   *                       type: string
   *                       format: date-time
   *                       example: 2023-07-21T19:58:00.000Z
   *                     salary_range:
   *                       type: string
   *                       example: 50k_to_70k
   *                     job_type:
   *                       type: string
   *                       example: full-time
   *                     job_mode:
   *                       type: string
   *                       example: remote
   *                     company_name:
   *                       type: string
   *                       example: ABC Company
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Invalid request
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */
  async createJob(req: Request, res: Response) {
    try {
      const validationResult = validateCreateJob(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          status: "error",
          status_code: 400,
          message: `Invalid request, ${validationResult.error.errors[0].path[0]} is required`,
        });
      }

      const job = await this.jobService.createJob(req.body, req.user?.id);
      res.json({
        status: "success",
        status_code: 201,
        message: "Job listing created successfully",
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
   *     summary: Get a job listing by id
   *     description: Get a job listing by id
   *     tags: [Jobs]
   *     parameters:
   *       - in: path
   *         name: jobId
   *         description: Job id
   *         required: true
   *         schema:  
   *           type: string
   *           format: uuid
   *     responses: 
   *       200:
   *         description: Job listing found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:      
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Job listing found
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: 123e4567-e89b-12d3-a456-426614174000
   *                     title:
   *                       type: string
   *                       example: Software Engineer
   *                     description:
   *                       type: string
   *                       example: This is a job description
   *                     location:
   *                       type: string
   *                       example: Remote
   *                     deadline:
   *                       type: string
   *                       format: date-time
   *                       example: 2023-07-21T19:58:00.000Z
   *                     salary_range:
   *                       type: string
   *                       example: 50k_to_70k
   *                     job_type:
   *                       type: string
   *                       example: full-time
   *                     job_mode:
   *                       type: string
   *                       example: remote
   *                     company_name:
   *                       type: string
   *                       example: ABC Company
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Invalid request
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */
  async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await this.jobService.getJobById(id);
      if (!job) {
        return res.status(404).json({
          status: "error",
          status_code: 404,
          message: "Job listing not found",
        });
      }
      res.json({
        status: "success",
        status_code: 200,
        message: "Job listing retrieved successfully",
        data: job,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status_code: 500 });
    }
  }

}
