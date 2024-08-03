import { z } from "zod";

const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  admin_secret: z.string().optional(),
});

const otpSchema = z.object({
  token: z
    .string()
    .min(1, "Token is required")
    .min(6, "Token must be at least 6 characters long"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const GoogleUserPayloadSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  id_token: z.string(),
  expires_at: z.number(),
  provider: z.string(),
  type: z.string(),
  providerAccountId: z.string(),
});

export { signUpSchema, otpSchema, loginSchema, GoogleUserPayloadSchema };
