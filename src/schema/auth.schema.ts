import { object, string, TypeOf, z } from "zod";
import { emailSchema } from "../utils/request-body-validator";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateMagicLink:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *     ValidateMagicLink:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           example: "exampleToken123"
 */

const createMagicLinkPayload = {
  body: object({
    email: emailSchema,
  }),
};

const magicLinkQuery = object({
  token: string().min(1, "Token is required"),
});

export const validateMagicLinkSchema = object({
  query: magicLinkQuery,
});

export const createMagicLinkSchema = object({ ...createMagicLinkPayload });
export const enable2FASchema = z.object({
  password: z.string(),
});

export type validateMagicLinkInput = TypeOf<typeof validateMagicLinkSchema>;
export type CreateMagicLinkInput = TypeOf<typeof createMagicLinkSchema>;
