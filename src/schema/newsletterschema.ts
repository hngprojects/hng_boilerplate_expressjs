import { array, number, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Newsletter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "newsletterId123"
 *         title:
 *           type: string
 *           example: "Weekly Update"
 *         content:
 *           type: string
 *           example: "This is the content of the newsletter."
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 100
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 10
 *     GetAllNewslettersResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Newsletters retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Newsletter'
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 */

const newsletterSchema = object({
  id: string(),
  title: string(),
  content: string(),
});

const paginationMetaSchema = object({
  total: number(),
  page: number(),
  limit: number(),
  totalPages: number(),
});

const getAllNewslettersResponseSchema = object({
  status: string().default("success"),
  message: string().default("Newsletters retrieved successfully"),
  data: array(newsletterSchema),
  meta: paginationMetaSchema,
});

export type GetAllNewslettersResponse = TypeOf<
  typeof getAllNewslettersResponseSchema
>;
