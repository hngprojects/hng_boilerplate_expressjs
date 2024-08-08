import { NextFunction, Request, Response } from "express";
import { ResourceNotFound, ServerError } from "../middleware";
import { OrgService } from "../services/org.services";
import log from "../utils/logger";

export class OrgController {
  private orgService: OrgService;
  constructor() {
    this.orgService = new OrgService();
  }

  /**
   * @swagger
   * /api/v1/organizations:
   *   post:
   *     summary: Create a new organisation
   *     description: This endpoint allows a user to create a new organisation
   *     tags: [Organisation]
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
   *               address:
   *                 type: string
   *                 example: 121 ikeja
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
   *               - address
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
   *                     address:
   *                       type: string
   *                       example: 121 ikeja
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
   */

  async createOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const user = req.user;
      const userId = user.id;

      const organisationService = new OrgService();
      const new_organisation = await organisationService.createOrganisation(
        payload,
        userId,
      );

      const respObj = {
        status: "success",
        message: "organisation created successfully",
        data: new_organisation,
        status_code: 201,
      };

      return res.status(201).json(respObj);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{userId}/organizations:
   *   get:
   *     summary: Get user organizations
   *     description: Retrieve all organizations associated with a specific user
   *     tags: [Organisation]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Organizations retrieved successfully
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
   *                   example: Organizations retrieved successfully.
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   *       400:
   *         description: Invalid user ID or authentication mismatch
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
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Invalid user ID or authentication mismatch.
   *       500:
   *         description: Internal server error
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
   *                   example: Failed to retrieve organizations. Please try again later.
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

  /**
   * @swagger
   * /api/v1/organizations/{org_id}:
   *   get:
   *     summary: Get a single organization
   *     description: Retrieve details of a specific organization by its ID
   *     tags: [Organisation]
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
      const org = await this.orgService.getSingleOrg(
        req.params.org_id,
        req.user.id,
      );
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

  /**
   * @swagger
   * /api/v1/organizations/{org_id}/user/{user_id}:
   *   delete:
   *     summary: Remove a user from an organization
   *     description: Delete a user from a specific organization by user ID and organization ID
   *     tags: [Organisation]
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
   * /organizations/{organization_id}:
   *   put:
   *     summary: Update organization details
   *     description: Updates the details of an organization by its ID.
   *     tags:
   *       - Organization
   *     parameters:
   *       - in: path
   *         name: organization_id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the organization to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Organization details updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     address:
   *                       type: string
   *                     phone:
   *                       type: string
   *                     email:
   *                       type: string
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
   *                 message:
   *                   type: string
   *       500:
   *         description: Failed to update organization details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                 message:
   *                   type: string
   */
  async updateOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.org_id;
      const payload = req.body;

      const updatedOrganisation =
        await this.orgService.updateOrganizationDetails(orgId, payload);

      if (!updatedOrganisation) {
        return res.status(404).json({
          status: "error",
          message: "Organisation not found",
          status_code: 404,
        });
      }

      const respObj = {
        status: "success",
        message: "Organisation updated successfully",
        data: updatedOrganisation,
        status_code: 200,
      };

      return res.status(200).json(respObj);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /organizations/accept-invite:
   *   post:
   *     summary: Accept an invitation to join an organization
   *     description: Accept an invitation to join an organization using a token provided in the query parameters.
   *     tags: [Organization]
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: The invitation token
   *     responses:
   *       200:
   *         description: You have been added to the organization.
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
   *                   example: You have been added to the organization.
   *       422:
   *         description: Invite token is required.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 422
   *                 message:
   *                   type: string
   *                   example: Invite token is required!
   *       404:
   *         description: Resource not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: Resource not found.
   *       409:
   *         description: Conflict - already a member.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 409
   *                 message:
   *                   type: string
   *                   example: You are already a member.
   *       400:
   *         description: An error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Error message
   */

  public async acceptInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      if (!token) {
        res.status(422).json({
          status: "Unsuccessful",
          status_code: 422,
          message: "Invite token is required!",
        });
        return;
      }
      const userId = req.user.id;

      await this.orgService.joinOrganizationByInvite(token, userId);

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "You have been added to the organization.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /organizations/{org_id}/invite:
   *   get:
   *     summary: Generate an invitation link for an organization
   *     description: Generate an invitation link for an organization using the organization ID provided in the URL parameters.
   *     tags: [Organization]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization
   *     responses:
   *       200:
   *         description: Invitation link generated successfully.
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
   *                 invite_token:
   *                   type: string
   *                   example: generated-token
   *       404:
   *         description: Organization not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: Organization not found.
   *       400:
   *         description: An error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Error message
   */

  public async generateInviteLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orgId = req.params.org_id;

      const invite_link = await this.orgService.generateInviteLink(orgId);
      res.status(200).json({
        status: "success",
        status_code: 200,
        invite_link,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /organizations/{org_id}/send-invite:
   *   post:
   *     summary: Send invitation links to join an organization
   *     description: Send invitation links to a list of emails to join an organization using the organization ID provided in the URL parameters.
   *     tags: [Organization]
   *     parameters:
   *       - in: path
   *         name: org_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: The list of emails to send invitations to
   *             example:
   *               email: ["user1@example.com", "user2@example.com"]
   *     responses:
   *       200:
   *         description: Invitations successfully sent.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Invitations successfully sent.
   *       422:
   *         description: Emails are required.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 422
   *                 message:
   *                   type: string
   *                   example: Emails are required!
   *       404:
   *         description: Organization not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: Organization not found.
   *       400:
   *         description: An error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Error message
   */

  public async sendInviteLinks(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;
      const orgId = req.params.org_id;

      if (!email) {
        return res.status(422).json({
          status: "Unsuccessful",
          status_code: 422,
          message: "Emails are required!",
        });
      }

      const emailList = Array.isArray(email) ? email : [email];

      await this.orgService.sendInviteLinks(orgId, emailList);

      res.status(200).json({
        status: "Success",
        status_code: 200,
        message: "Invitations successfully sent.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/members/search:
   *   post:
   *     summary: Search organization members by name or email
   *     tags: [Members]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 example: "johndoe@example.com"
   *             required:
   *               - name
   *               - email
   *     responses:
   *       200:
   *         description: List of organization members matching the search criteria
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 result:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       organizationId:
   *                         type: string
   *                       organizationName:
   *                         type: string
   *                       organizationEmail:
   *                         type: string
   *                       members:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             userId:
   *                               type: string
   *                             userName:
   *                               type: string
   *                             userEmail:
   *                               type: string
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *       400:
   *         description: At least one search criterion (name or email) must be provided
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       404:
   *         description: No members found matching the search criteria
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: An error occurred while searching for members
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */
  async searchOrganizationMembers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { name, email } = req.query;

    if (!name && !email) {
      return res.status(400).json({
        error:
          "At least one search criterion (name or email) must be provided.",
        status_code: "400",
      });
    }

    try {
      const result = await this.orgService.searchOrganizationMembers({
        name: name as string,
        email: email as string,
      });
      if (result.length > 0) {
        return res.status(200).json({
          result: result,
          status_code: 200,
        });
      } else {
        return res.status(404).json({
          error: "No members found matching the search criteria.",
          status_code: 404,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getSingleRole(req: Request, res: Response, next: NextFunction) {
    try {
      const organizationId = req.params.org_id;
      const roleId = req.params.role_id;
      const response = await this.orgService.fetchSingleRole(
        organizationId,
        roleId,
      );

      if (!response || response === null) {
        return res.status(200).json({
          status_code: "200",
          message: `The role with ID ${roleId} does not exist in the organisation`,
        });
      }

      return res.status(200).json({
        status_code: 200,
        data: response,
      });
    } catch (error) {
      if (error instanceof ResourceNotFound) {
        next(error);
      }
      next(new ServerError("Encountered error while fetching user"));
    }
  }

  async getAllOrganizationRoles(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const organizationId = req.params.org_id;
      const response =
        await this.orgService.fetchAllRolesInOrganization(organizationId);

      return res.status(200).json({
        status_code: 200,
        data: response,
      });
    } catch (error) {
      if (error instanceof ResourceNotFound) {
        next(error);
      }
      next(new ServerError("Error fetching all roles in organization"));
    }
  }
}
