import { array, number, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_name:
 *           type: string
 *           example: "Lewis"
 *         email:
 *           type: string
 *           example: "lewis@gmail.com"
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "58b6"
 *         user_name:
 *           type: string
 *           example: "yasuke"
 *         email:
 *           type: string
 *           example: "sam@gmail.com"
 *         profile_picture:
 *           type: string
 *           example: "https://avatar.com"
 *         bio:
 *           type: string
 *           example: "Developer at HNG"
 *     GetProfileResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: number
 *           example: 200
 *         data:
 *           $ref: '#/components/schemas/UserProfile'
 *     GetAllUsersResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         status_code:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: "Users retrieved successfully"
 *         pagination:
 *           type: object
 *           properties:
 *             totalItems:
 *               type: number
 *               example: 100
 *             totalPages:
 *               type: number
 *               example: 10
 *             currentPage:
 *               type: number
 *               example: 1
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     DeleteUserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         status_code:
 *           type: number
 *           example: 202
 *         message:
 *           type: string
 *           example: "User deleted successfully"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Timezone:
 *       type: object
 *       properties:
 *         timezone:
 *           type: string
 *           example: "America/New_York"
 *         gmtOffset:
 *           type: string
 *           example: "-05:00"
 *         description:
 *           type: string
 *           example: "Eastern Standard Time"
 */

const payload = object({
  id: string(),
  user_name: string(),
  email: string(),
  profile_picture: string(),
  bio: string(),
});

const paginationSchema = object({
  totalItems: number(),
  totalPages: number(),
  currentPage: number(),
});

const params = {
  params: object({
    id: string({
      required_error: "userId is required",
    }),
  }),
};

export const getUserProfileSchema = object({
  response: object({
    status_code: number(),
    data: payload,
  }),
});

export const getAllUsersSchema = object({
  response: object({
    status: string(),
    status_code: number(),
    message: string(),
    pagination: paginationSchema,
    data: array(payload),
  }),
});

export const deleteUserSchema = object({
  ...params,
  response: object({
    status: string(),
    status_code: number(),
    message: string(),
  }),
});

const timezoneSchema = object({
  timezone: string({
    required_error: "Timezone is required",
  }),
  gmtOffset: string({
    required_error: "GMT Offset is required",
  }),
  description: string({
    required_error: "Description is required",
  }),
});

export const updateUserTimezoneSchema = object({
  ...params,
  body: timezoneSchema,
});

export type GetUserProfileResponse = TypeOf<
  typeof getUserProfileSchema
>["response"];
export type GetAllUsersResponse = TypeOf<typeof getAllUsersSchema>["response"];
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
export type DeleteUserResponse = TypeOf<typeof deleteUserSchema>["response"];
export type UpdateUserTimezoneInput = TypeOf<typeof updateUserTimezoneSchema>;
