import { z } from "zod";

const orgUpdateSchema = z.object({
  name: z.string().min(1, "organization name is required"),
  email: z.string().email("Invalid email address"),
  industry: z.string().min(1, "industry name is required"),
  type: z.string().min(1, "Orgnization type is required"),
  country: z.string().min(1, "country name is required"),
  address: z.string().min(1, "organisation addrerss is required"),
  state: z.string().min(1, "state is required"),
  description: z.string().min(1, "description is required"),
});

export { orgUpdateSchema };
