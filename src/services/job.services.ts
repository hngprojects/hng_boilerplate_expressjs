import AppDataSource from "../data-source";
import { JobListing } from "../models/jobs";
import { IJobListingService } from "../types";


export class JobListingService implements IJobListingService {
    title: string;
    description: string;
    location: string;
    salary: string;
    job_type: string;
    
    constructor() {
        this.title = "";
        this.description = "";
        this.location = "";
        this.salary = "";
        this.job_type = "";
    }
    
    public async getAllJobListings(
        page: number,
        size: number
    ): Promise<{ jobListings: JobListing[]; total: number } | null> {
        const jobListingRepository = AppDataSource.getRepository(JobListing);
    
        try {
        const [jobListings, total] = await jobListingRepository.findAndCount({
            select: ["id", "title", "description", "location", "salary", "job_type"],
            skip: (page - 1) * size,
            take: size,
        });
    
        if (jobListings.length === 0) {
            return null;
        }
    
        return {
            jobListings,
            total,
        };
        } catch (error) {
        console.error("Error fetching job listings:", error);
        return null;
        }
    }
}