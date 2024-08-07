import { Repository } from "typeorm";
import { JobService } from '../services/jobservice';
import { Job } from '../models/job';
import { getJobSchema } from '../schemas/job';
import { ServerError, ResourceNotFound } from "../middleware";

jest.mock("../utils", () => ({
  getIsInvalidMessage: jest
    .fn()
    .mockImplementation((field: string) => `${field} is invalid`),
}));

jest.mock("../data-source", () => ({
  getRepository: jest.fn().mockImplementation((entity) => ({
    create: jest.fn().mockReturnValue({}),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    })),
  })),
}));

jest.mock('../schemas/job', () => ({
  getJobSchema: jest.fn()
}));

describe("JobService", () => {
  let jobService: JobService;
  let jobRepository: Repository<Job>;

  beforeEach(() => {
    jobService = new JobService();
    jobRepository = jobService["jobRepository"];
  });

  describe("getJob", () => {
    it("should retrieve a job successfully", async () => {
      // Mock data
      const mockJobId = "1";
      const mockJob: Job = {
        id: "1",
        title: "Software Engineer",
        description: "This is a job description",
        location: "Remote",
        deadline: new Date("2023-07-21T19:58:00.000Z"),
        salary_range: "50k_to_70k",
        job_type: "full-time",
        job_mode: "remote",
        company_name: "ABC Company",
        is_deleted: false,
        user_id: "1",
        created_at: new Date("2023-07-21T19:58:00.000Z"),
        updated_at: new Date("2023-07-21T19:58:00.000Z"),
      };

      jobRepository.findOne = jest.fn().mockResolvedValue(mockJob);
      (getJobSchema as jest.Mock).mockReturnValue(mockJob);

      const result = await jobService.getJob(mockJobId);

      expect(jobRepository.findOne).toHaveBeenCalledWith({ where: { id: mockJobId } });
      expect(getJobSchema).toHaveBeenCalledWith(mockJob);
      expect(result).toEqual(mockJob);
    });

    it("should throw ResourceNotFound error when job is not found", async () => {
      const mockJobId = "1";
      jobRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(jobService.getJob(mockJobId)).rejects.toThrow(ResourceNotFound);
      expect(jobRepository.findOne).toHaveBeenCalledWith({ where: { id: mockJobId } });
    });

    it("should throw ServerError on database error", async () => {
      const mockJobId = "1";
      jobRepository.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

      await expect(jobService.getJob(mockJobId)).rejects.toThrow(ServerError);
      expect(jobRepository.findOne).toHaveBeenCalledWith({ where: { id: mockJobId } });
    });
  });
});
