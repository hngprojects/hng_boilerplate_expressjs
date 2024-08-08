import { NextFunction, Request, Response } from "express";
import { Job } from "../models";
import AppDataSource from "../data-source";
import { Repository } from "typeorm";
import { HttpError } from "../middleware";

export class JobService {
  private jobRepository: Repository<Job>;

  constructor() {
    this.jobRepository = AppDataSource.getRepository(Job);
  }

  public async create(req: Request): Promise<Job | null> {
    const { title, description, location, salary, job_type, company_name } =
      req.body;
    const user_id = (req as Record<string, any>).user.id;

    const jobEntity = Job.create({
      user_id,
      title,
      description,
      location,
      salary,
      job_type,
      company_name,
    });
    const job = await Job.save(jobEntity);
    return job;
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
