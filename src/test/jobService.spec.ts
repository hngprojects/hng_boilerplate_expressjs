import { JobService } from "../services/job.service";
import { Repository } from "typeorm";
import { Job } from "../models/job";
import AppDataSource from "../data-source";
import { BadRequest } from "../middleware";

jest.mock("../data-source");

describe("JobService", () => {
  let jobService: JobService;
  let jobRepository: jest.Mocked<Repository<Job>>;

  beforeEach(() => {
    jobRepository = {
      findOne: jest.fn(),
    } as any;

    AppDataSource.getRepository = jest.fn().mockImplementation((model) => {
      if (model === Job) {
        return jobRepository;
      }
      throw new Error("Unknown model");
    });

    jobService = new JobService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getJobById", () => {
    it("should return job details for a valid ID", async () => {
      const jobId = "1";
      const jobDetails = {
        id: jobId,
        title: "Software Engineer",
        description: "Job description here...",
        user_id: "21",
        location: "Remote",
        salary: "60000",
        job_type: "Developer",
        company_name: "Company Name",
      } as Job;

      jobRepository.findOne.mockResolvedValue(jobDetails);

      const result = await jobService.getById(jobId);

      expect(jobRepository.findOne).toHaveBeenCalledWith({
        where: { id: jobId },
      });
      expect(result).toEqual(jobDetails);
    });
  });
});
