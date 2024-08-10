import { Repository } from "typeorm";
import { Job, User, SalaryRange, JobType, JobMode } from "../models";
import AppDataSource from "../data-source";
import { ICreateJobs } from "../types";
import { HttpError } from "../middleware";

export class JobService {
  private userRepository: Repository<User>;
  private jobRepository: Repository<Job>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.jobRepository = AppDataSource.getRepository(Job);
  }

  async createJob(
    createJobBody: ICreateJobs,
    ownerId: User["id"],
  ): Promise<Job> {
    try {
      return await AppDataSource.manager.transaction(
        async (transactionalEntityManager) => {
          const user = await transactionalEntityManager.findOne(User, {
            where: { id: ownerId },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const newJob = new Job();
          newJob.title = createJobBody.title;
          newJob.description = createJobBody.description;
          newJob.location = createJobBody.location;
          newJob.deadline = createJobBody.deadline;
          newJob.salary_range = createJobBody.salary_range;
          newJob.job_type = createJobBody.job_type;
          newJob.job_mode = JobMode[createJobBody.job_mode];
          newJob.company_name = createJobBody.company_name;
          newJob.user = user;

          return await transactionalEntityManager.save(Job, newJob);
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getById(jobId: string): Promise<Job | null> {
    try {
      const job = await this.jobRepository.findOne({
        where: { id: jobId },
      });

      return job;
    } catch (error) {
      throw new Error("Failed to fetch job details");
    }
  }

  public async getAllJobs(): Promise<Job[] | null> {
    try {
      return await Job.find();
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      throw new Error("Could not fetch jobs ");
    }
  }

  public async delete(jobId: string): Promise<Job | null> {
    try {
      const existingJob = await this.jobRepository.findOne({
        where: { id: jobId },
      });
      if (!existingJob) {
        throw new HttpError(404, "Job not found");
      }

      await this.jobRepository.delete({ id: jobId });

      return existingJob;
    } catch (err) {
      if (err instanceof HttpError) {
        throw err;
      } else {
        throw new HttpError(500, err.message || "Error deleting job");
      }
    }
  }
}
