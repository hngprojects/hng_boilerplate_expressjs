import { z } from "zod";

const createTestimonialSchema = z.object({
  client_name: z.string().min(1, { message: "Client_name cannot be empty" }),
  client_position: z
    .string()
    .min(1, { message: "Client_position cannot be empty" }),
  testimonial: z.string().min(1, { message: "Testimonial cannot be empty" }),
});

const updateTestimonialSchema = z.object({
  client_name: z
    .string()
    .min(1, { message: "Client_name cannot be empty" })
    .optional(),
  client_position: z
    .string()
    .min(1, { message: "Client_position cannot be empty" })
    .optional(),
  testimonial: z
    .string()
    .min(1, { message: "Testimonial cannot be empty" })
    .optional(),
});

export { createTestimonialSchema, updateTestimonialSchema };
