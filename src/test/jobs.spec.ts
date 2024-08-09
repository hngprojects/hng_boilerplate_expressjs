import { Request, Response } from "express";
import { JobController } from "../controllers/jobController";
import { JobService } from "../services/job.service";

// Mock the JobService module
jest.mock("../services/job.service");

describe("JobController", () => {
  let jobController: JobController;
  let jobService: JobService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jobService = new JobService();
    jobController = new JobController();
    jobController["jobService"] = jobService; // Inject the mocked service
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllJobs", () => {
    it("should return an array of jobs with a 200 status code", async () => {
      // Arrange
      const mockJobs = [
        { id: 1, title: "Software Developer" },
        { id: 2, title: "Data Scientist" },
      ];
      (jobService.getAllJobs as jest.Mock).mockResolvedValue(mockJobs);

      // Act
      await jobController.getAllJobs(req as Request, res as Response);

      // Assert
      expect(jobService.getAllJobs).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Jobs retrieved successfully",
        billing: mockJobs,
      });
    });

    it("should return a 500 status code with an error message if jobService throws an error", async () => {
      // Arrange
      const errorMessage = "Failed to fetch jobs";
      (jobService.getAllJobs as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      // Act
      await jobController.getAllJobs(req as Request, res as Response);

      // Assert
      expect(jobService.getAllJobs).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
