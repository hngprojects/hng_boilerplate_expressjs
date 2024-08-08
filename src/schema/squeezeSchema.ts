import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Squeeze:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "e02c7c4e-bb92-4f9a-8d91-bc9e63c5b8d5"
 *         email:
 *           type: string
 *           format: email
 *           example: "naina@example.com"
 *         first_name:
 *           type: string
 *           example: "Nainah"
 *         last_name:
 *           type: string
 *           example: "Kamah"
 *         phone:
 *           type: string
 *           example: "+254123456789"
 *         location:
 *           type: string
 *           example: "Nairobi"
 *         job_title:
 *           type: string
 *           example: "Backend Engineer"
 *         company:
 *           type: string
 *           example: "HNG"
 *         interests:
 *           type: array
 *           example: ["Tech", "Politics", "Youth"]
 *         referral_source:
 *           type: string
 *           example: "Internet"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-08-03T14:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-08-03T14:00:00Z"
 *       required:
 *         - id
 *         - email
 *         - createdAt
 *         - updatedAt
 */
const squeezeSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  job_title: z.string().optional(),
  company: z.string().optional(),
  interests: z.array(z.string()).optional(),
  referral_source: z.string().optional(),
});

export { squeezeSchema };
