import { Request, Response } from "express";
import { OrgService } from "../services/organisation.service";

export class OrgController {
  private orgService: OrgService;
  constructor() {
    this.orgService = new OrgService();
  }

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
        message: "User deleted succesfully",
        status_code: 200,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to remove user from organization" });
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
}
