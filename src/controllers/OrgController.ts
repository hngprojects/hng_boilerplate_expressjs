import { Request, Response } from "express";
import { OrgService } from "../services/org.services";
import log from "../utils/logger";

export class OrgController {
  private orgService: OrgService;
  constructor() {
    this.orgService = new OrgService();
  }

  /**
   * @swagger
   * /api/org/{org_id}/user/{user_id}:
   *   delete:
   *     summary: Remove a user from an organization
   *     description: Delete a user from a specific organization by user ID and organization ID
   *     tags: [Organizations]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: User deleted successfully
   *       404:
   *         description: User not found in the organization
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: forbidden
   *                 message:
   *                   type: string
   *                   example: User not found in the organization
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       400:
   *         description: Failed to remove user from organization
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Bad Request
   *                 message:
   *                   type: string
   *                   example: Failed to remove user from organization
   *                 status_code:
   *                   type: integer
   *                   example: 400
   */
  async removeUser(req: Request, res: Response) {
    try {
      const user = await this.orgService.removeUser(
        req.params.org_id,
        req.params.user_id,
      );
      if (!user) {
        return res.status(404).json({
          status: "forbidden",
          message: "User not found in the organization",
          status_code: 404,
        });
      }
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        status_code: 200,
      });
    } catch (error) {
      res.status(400).json({
        status: "Bad Request",
        message: "Failed to remove user from organization",
        status_code: "400",
      });
    }
  }

  /**
   * @swagger
   * /api/org/{org_id}:
   *   get:
   *     summary: Get a single organization
   *     description: Retrieve details of a specific organization by its ID
   *     tags: [Organizations]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: object
   *                   description: The organization details
   *       404:
   *         description: Organization not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: forbidden
   *                 message:
   *                   type: string
   *                   example: Organization not found
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Failed to get user organisation. Please try again later.
   */

  async getOrganizations(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      log.info("req.user:", req.user);
      if (!req.user || req.user.id !== userId) {
        return res.status(400).json({
          status: "unsuccessful",
          status_code: 400,
          message: "Invalid user ID or authentication mismatch.",
        });
      }
      const organizations =
        await this.orgService.getOrganizationsByUserId(userId);

      if (organizations.length === 0) {
        return res.status(200).json({
          status: "success",
          status_code: 200,
          message: "No organizations found for this user.",
          data: [],
        });
      }

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Organizations retrieved successfully.",
        data: organizations,
      });
    } catch (error) {
      log.error("Failed to retrieve organizations:", error);
      res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Failed to retrieve organizations. Please try again later.",
      });
    }
  }

  async getSingleOrg(req: Request, res: Response) {
    try {
      const org = await this.orgService.getSingleOrg(req.params.org_id);
      if (!org) {
        return res.status(404).json({
          status: "forbidden",
          message: "Organization not found",
          status_code: 404,
        });
      }
      res.status(200).json({
        status: "success",
        status_code: 200,
        data: {
          org_id: org.id,
          name: org.name,
          description: org.description,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Failed to get user organisation. Please try again later.",
      });
    }
  }
  async createInvitation(req: Request, res: Response) {
    try {
      const { org_id } = req.params;
      const { email, expiresIn } = req.body;

      if (!email || expiresIn) {
        return res.status(400).json({
          status: "unsuccessful",
          message: "Valid email or expire time must be provided",
          status_code: 400,
        });
      }

      if (!org_id) {
        return res.status(404).json({
          status: "unsuccessful",
          message: "Organization not found",
          status_code: 404,
        });
      }

      const invitation = await this.orgService.createInvitation(
        org_id,
        email,
        expiresIn
      );

      return res.status(201).json({
        status: "success",
        message: "Invitation sent successfully",
        data: { invitation },
        status_code: 201,
      });
    } catch (error) {
      return res.status(500).json({
        status: "success",
        message: "Failed to send invitation.",
        status_code: 500,
      });
    }
  }
}
