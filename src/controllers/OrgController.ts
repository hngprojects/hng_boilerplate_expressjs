import { Request, Response, NextFunction } from "express";
import { OrgService } from "../services/org.services";
import log from "../utils/logger";

export class OrgController {
  private orgService: OrgService;
  constructor() {
    this.orgService = new OrgService();
  }
  public async createInvitation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;
      const orgId = req.params.orgId;
      const inviterId = req.user.id;

      if (!email) {
        res.status(422).json({
          status: "Unsuccessful",
          status_code: 422,
          message: "Email is required!",
        });
        return;
      }

      await this.orgService.createInvitation(orgId, email, inviterId);

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Invitation successfully sent.",
      });
    } catch (error) {
      res.status(400).json({
        status: "unsuccessful",
        status_code: 400,
        message: error.message,
      });
    }
  }

  public async joinOrganization(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { inviteToken } = req.body;
      const userId = req.user.id; //id of the user to join the org  by invite
      if (!inviteToken) {
        res.status(422).json({
          status: "Unsuccessful",
          status_code: 422,
          message: "Invite token is required!",
        });
        return;
      }
      await this.orgService.joinOrganizationByInvite(inviteToken, userId);

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "User successfully added to the organization.",
      });
    } catch (error) {
      res.status(400).json({
        status: "unsuccessful",
        status_code: 400,
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /organisation:
   *   post:
   *     summary: Create a new organisation
   *     description: This endpoint allows a user to create a new organisation
   *     tags: [Organisations]
   *     operationId: createOrganisation
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       description: Organisation payload
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: My Organisation
   *               description:
   *                 type: string
   *                 example: This is a sample organisation.
   *               email:
   *                 type: string
   *                 example: name@gmail.com
   *               industry:
   *                 type: string
   *                 example: entertainment
   *               type:
   *                 type: string
   *                 example: music
   *               country:
   *                 type: string
   *                 example: Nigeria
   *               state:
   *                 type: string
   *                 example: Oyo
   *             required:
   *               - name
   *               - description
   *               - email
   *               - industry
   *               - type
   *               - country
   *               - state
   *     responses:
   *       '201':
   *         description: Organisation created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Organisation created successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "1"
   *                     name:
   *                       type: string
   *                       example: My Organisation
   *                     description:
   *                       type: string
   *                       example: This is a sample organisation.
   *                     email:
   *                       type: string
   *                       example: abc@gmail.com
   *                     industry:
   *                       type: string
   *                       example: entertainment
   *                     type:
   *                       type: string
   *                       example: music
   *                     country:
   *                       type: string
   *                       example: Nigeria
   *                     state:
   *                       type: string
   *                       example: Oyo
   *                     slug:
   *                       type: string
   *                       example: 86820688-fd94-4b58-9bdd-99a701714a77
   *                     owner_id:
   *                       type: string
   *                       example: 86820688-fd94-4b58-9bdd-99a701714a76
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                 status_code:
   *                   type: integer
   *                   example: 201
   *       '400':
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Invalid input
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       '500':
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Internal server error
   *                 status_code:
   *                   type: integer
   *                   example: 500
   * components:
   *   securitySchemes:
   *     bearerAuth:
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   *
   *
   */

  async createOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const user = req.user;
      const userId = user.id;

      const organisationService = new OrgService();
      const newOrganisation = await organisationService.createOrganisation(
        payload,
        userId,
      );

      const respObj = {
        status: "success",
        message: "organisation created successfully",
        data: newOrganisation,
        status_code: 201,
      };

      return res.status(201).json(respObj);
    } catch (error) {
      next(error);
    }
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

  /**
   * @swagger
   * /api/v1/organisation/{org_id}:
   *   get:
   *     summary: Get a single organization
   *     description: Retrieve details of a specific organization by its ID
   *     tags: [Organisations]
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
   *                   properties:
   *                       org_id:
   *                          type: string
   *                          example: "2928a3d6-2b85-4abc-9438-ff9769b126ed"
   *                       name:
   *                          type: string
   *                          example: "Organisation 1"
   *                       description:
   *                          type: string
   *                          example: "Description of the organisation"
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
      // check if org exists
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
