import { Repository } from "typeorm";
import { User } from "../models";
import AppDataSource from "../data-source";
import { ICreateJobs, JobMode } from "../types";
import { Job } from "../models/job";

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
          newJob.user_id = user.id;

          return await transactionalEntityManager.save(Job, newJob);
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async getJobById(jobId: string): Promise<Job> {
    try {
      return await this.jobRepository.findOne({
        where: { id: jobId },
      });
    } catch (error) {
      throw new Error(error);
    }
   
  async getAllJobs(): Promise<Job[]> {
    try {
      return await this.jobRepository.find();
    } catch (error) {
      console.error("Error retrieving jobs:", error.message);
      throw new Error("Failed to retrieve jobs");
    }
  }
}
