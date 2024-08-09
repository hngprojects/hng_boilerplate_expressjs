import { array, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     OrganizationRole:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "roleId123"
 *         name:
 *           type: string
 *           example: "Admin"
 *         description:
 *           type: string
 *           example: "Administrator role with full access"
 *     GetAllOrganizationRolesResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 200
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrganizationRole'
 */

const getAllOrganizationRolesResponseSchema = object({
  status_code: string().regex(
    /^\d{3}$/,
    "Status code should be a three-digit number",
  ),
  data: array(
    object({
      id: string(),
      name: string(),
      description: string().optional(),
    }),
  ),
});

export type GetAllOrganizationRolesResponse = TypeOf<
  typeof getAllOrganizationRolesResponseSchema
>;

/**
 * @openapi
 * components:
 *   schemas:
 *     SingleRoleResponse:
 *       type: object
 *       properties:
 *         status_code:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "roleId123"
 *             name:
 *               type: string
 *               example: "Admin"
 *             description:
 *               type: string
 *               example: "Administrator role with full access"
 *         message:
 *           type: string
 *           example: "The role with ID roleId123 does not exist in the organisation"
 */

const singleRoleResponseSchema = object({
  status_code: string().regex(
    /^\d{3}$/,
    "Status code should be a three-digit number",
  ),
  data: object({
    id: string().optional(),
    name: string().optional(),
    description: string().optional(),
  }).optional(),
  message: string().optional(),
});

export type SingleRoleResponse = TypeOf<typeof singleRoleResponseSchema>;
