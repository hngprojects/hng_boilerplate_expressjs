import { NextFunction, Request, Response } from "express";
import { Job } from "../models";
import AppDataSource from "../data-source";

import { Repository } from "typeorm";

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
}
