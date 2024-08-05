import { z } from "zod";

const contactUsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});

export { contactUsSchema };
