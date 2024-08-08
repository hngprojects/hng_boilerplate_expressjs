import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

const createBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  image_url: z.string(),
  tags: z.string().optional(),
  categories: z.string().optional(),
  publish_date: z.string().optional(),
});

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  salary_range: z.enum([
    "below_30k",
    "30k_to_50k",
    "50k_to_70k",
    "70k_to_100k",
    "100k_to_150k",
    "above_150k",
  ]),
  job_type: z.enum(["full-time", "part-time", "internship", "contract"]),
  job_mode: z.enum(["remote", "onsite"]),
  company_name: z.string().min(1, "Company name is required"),
});

export const validateCreateJob = (data: any) => {
  return createJobSchema.safeParse(data);
};

// export const BillingPlanSchema = z.object({
//   id: z.string().uuid(),
//   name: z.string().min(1),
//   price: z.number().int().nonnegative(),
// });

// export type BillingPlanSchemaType = z.infer<typeof BillingPlanSchema>;

// export const CreateBillingPlanSchema = z.object({
//   name: z.string().min(1),
//   price: z.number().int().nonnegative(),
// });

// export type CreateBillingPlanDtoType = z.infer<typeof CreateBillingPlanSchema>;

export const billingPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
});

export type BillingPlanInput = z.infer<typeof billingPlanSchema>;

export { createBlogSchema, emailSchema };
