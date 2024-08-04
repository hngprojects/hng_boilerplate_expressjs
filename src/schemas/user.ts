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
  access_token: z.string().min(1, "Access token is required."),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
  scope: z.string().min(1, "Scope is required."),
  token_type: z.string().optional(),
  id_token: z.string().min(1, "ID token is required."),
  expires_at: z.number().optional(),
  provider: z.string().optional(),
  type: z.string().optional(),
  providerAccountId: z.string().optional(),
});

export { signUpSchema, otpSchema, loginSchema, GoogleUserPayloadSchema };
