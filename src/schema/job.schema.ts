import { boolean, number, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - deadline
 *         - salary_range
 *         - job_type
 *         - job_mode
 *         - company_name
 *       properties:
 *         title:
 *           type: string
 *           default: "Software Engineer"
 *         description:
 *           type: string
 *           default: "This is a job description"
 *         location:
 *           type: string
 *           default: "Remote"
 *         deadline:
 *           type: string
 *           format: date-time
 *           default: 2023-07-21T19:58:00.000Z
 *         salary_range:
 *           type: string
 *           enum: [below_30k, 30k_to_50k, 50k_to_70k, 70k_to_100k, 100k_to_150k, above_150k]
 *           default: 50k_to_70k
 *         job_type:
 *           type: string
 *           enum: [full-time, part-time, internship, contract]
 *           default: full-time
 *         job_mode:
 *           type: string
 *           enum: [remote, onsite]
 *           default: remote
 *         company_name:
 *           type: string
 *           default: ABC Company
 *     JobResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         salary_range:
 *           type: string
 *         job_type:
 *           type: string
 *         job_mode:
 *           type: string
 *         company_name:
 *           type: string
 */

const jobPayload = {
  body: object({
    title: string({
      required_error: "title is required",
    }),
    description: string({
      required_error: "description is required",
    }),
    location: string({
      required_error: "location is required",
    }),
    deadline: string({
      required_error: "deadline is required",
    }),
    salary_range: string({
      required_error: "salary_range is required",
    }),
    job_type: string({
      required_error: "job_type is required",
    }),
    job_mode: string({
      required_error: "job_mode is required",
    }),
    company_name: string({
      required_error: "company_name is required",
    }),
  }),
};

const paginationSchema = object({
  total_items: number(),
  total_pages: number(),
  current_page: number(),
});

const jobParams = {
  params: object({
    jobId: string({
      required_error: "jobId is required",
    }),
  }),
};

export const createJobSchema = object({
  ...jobPayload,
});

export const updateJobSchema = object({
  ...jobPayload,
  ...jobParams,
});

export const deleteJobSchema = object({
  ...jobParams,
});

export const getJobSchema = object({
  ...jobParams,
});

export const getAllJobsSchema = object({
  success: boolean(),
  message: string(),
  status_code: number(),
  pagination: paginationSchema,
  ...jobPayload,
});

export type CreateJobInput = TypeOf<typeof createJobSchema>;
export type UpdateJobInput = TypeOf<typeof updateJobSchema>;
export type ReadJobInput = TypeOf<typeof getJobSchema>;
export type DeleteJobInput = TypeOf<typeof deleteJobSchema>;
export type GetAllJobsResponse = TypeOf<typeof getAllJobsSchema>;
