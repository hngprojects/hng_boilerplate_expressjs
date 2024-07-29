import { boolean, number, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           default: "blog title 1"
 *         content:
 *           type: string
 *           default: "Blog wey make sense"
 *         author:
 *           type: string
 *           default: John Doe
 *         published_at:
 *           type: string
 *           format: date-time
 *           default: 2023-07-21T19:58:00.000Z
 *     BlogResponse:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 */

const payload = {
  body: object({
    title: string({
      required_error: "title is required",
    }),
    content: string({
      required_error: "content is required",
    }),
  }),
};

const paginationSchema = object({
  total_items: number(),
  total_pages: number(),
  current_page: number(),
});

const params = {
  params: object({
    blogId: string({
      required_error: "boogId is required",
    }),
  }),
};

export const createBlogSchema = object({
  ...payload,
});

export const updateBlogSchema = object({
  ...payload,
  ...params,
});

export const deleteBlogSchema = object({
  ...params,
});

export const getBlogSchema = object({
  ...params,
});

export const getAllBlogSchema = object({
  success: boolean(),
  message: string(),
  status_code: number(),
  pagination: paginationSchema,
  ...payload,
});

export type CreateBlogInput = TypeOf<typeof createBlogSchema>;
export type UpdateBlogInput = TypeOf<typeof updateBlogSchema>;
export type ReadBlogInput = TypeOf<typeof getBlogSchema>;
export type DeleteBlogInput = TypeOf<typeof deleteBlogSchema>;
export type GetAllBlogsResponse = TypeOf<typeof getAllBlogSchema>;
