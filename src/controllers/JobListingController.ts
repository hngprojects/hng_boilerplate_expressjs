import { Request, Response } from "express";
import { JobListingService } from "../services/job.services";

export class JobListingController {
    private jobListingService: JobListingService;
  
    constructor() {
      this.jobListingService = new JobListingService();
    }
  
    async getAllJobListings(req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
  
        const result = await this.jobListingService.getAllJobListings(page, size);
  
        if (!result) {
          return res.status(404).json({
            status: "not_found",
            message: "No job listings found",
            status_code: 404,
          });
        }
  
        res.status(200).json({
          status: "success",
          message: "Job listings retrieved successfully",
          status_code: 200,
          data: result.jobListings,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(result.total / size),
            page_size: size,
            total_items: result.total,
          },
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Failed to retrieve job listings",
          status_code: 500,
        });
      }
    }
}