// admin conroller
import { Request, Response } from "express";
import { AdminOrganisationService } from "../services";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Related Routes
 */

/**
 * @swagger
 * /api/v1/orgs/:{id}
 *   patch:
 *     summary: Admin-Update an existing organisation
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               slug:
 *                 type: string
 *               type:
 *                 type: string
 *               industry:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organisation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     type:
 *                       type: string
 *                     industry:
 *                       type: string
 *                     state:
 *                       type: string
 *                     country:
 *                       type: string
 *                     address:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
class AdminOrganisationController {
  private adminService: AdminOrganisationService;

  constructor() {
    this.adminService = new AdminOrganisationService();
  }

  public updateOrg = asyncHandler(async (req: Request, res: Response) => {
    const org = await this.adminService.update(req.params.id, req.body);
    if (org) {
      sendJsonResponse(res, 200, "Organization updated successfully", org);
    } else {
      res.status(400).json({
        message: "failed to update organisation",
      });
    }
  });

  /**
   * @swagger
   * /api/v1/orgs/{org_id}/delete:
   *   delete:
   *     summary: Admin-Delete an existing organization
   *     tags: [Admin]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         description: The ID of the organization to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Organization deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     description:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Valid organization ID must be provided
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *       404:
   *         description: Organization not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *       500:
   *         description: Failed to delete organization. Please try again later.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   */

  public deleteOrganization = asyncHandler(
    async (req: Request, res: Response) => {
      const { org_id } = req.params;

      if (!org_id) {
        return res.status(400).json({
          status: "unsuccessful",
          status_code: 400,
          message: "Valid organization ID must be provided.",
        });
      }
      const result = await this.adminService.deleteOrganization(org_id);
      sendJsonResponse(res, 200, "Organization deleted successfully", result);

      if (!result) {
        res.status(500).json({
          status: "unsuccessful",
          status_code: 500,
          message: "Failed to delete organization.",
        });
      }
    },
  );
}

class AdminUserController {}

class AdminLogController {}

export { AdminOrganisationController, AdminUserController, AdminLogController };
