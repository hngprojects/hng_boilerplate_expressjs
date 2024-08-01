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
});

export { createBlogSchema, emailSchema };
