import { object, string, TypeOf, z } from "zod";

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

const magiclinkSchema = z.object({
  email: z.string().email(""),
});

const createMagicLinkPayload = {
  body: object({
    email: magiclinkSchema,
  }),
};

const magicLinkQuery = object({
  token: string().min(1, "Token is required"),
});

const validateMagicLinkSchema = object({
  query: magicLinkQuery,
});

const createMagicLinkSchema = object({ ...createMagicLinkPayload });

type validateMagicLinkInput = TypeOf<typeof validateMagicLinkSchema>;
type CreateMagicLinkInput = TypeOf<typeof createMagicLinkSchema>;

export {
  CreateMagicLinkInput,
  createMagicLinkPayload,
  createMagicLinkSchema,
  magiclinkSchema,
  validateMagicLinkInput,
  validateMagicLinkSchema,
};
