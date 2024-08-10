import { NextFunction, Request, Response } from "express";
import { PermissionCategory } from "../enums/permission-category.enum";
import {
  HttpError,
  InvalidInput,
  ResourceNotFound,
  ServerError,
} from "../middleware";
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
   *     description: Update the details of an existing organization
   *     parameters:
   *       - in: path
   *         name: organization_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the organization to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - industry
   *               - type
   *               - country
   *               - address
   *               - state
   *               - description
   *             properties:
   *               name:
   *                 type: string
   *                 example: "New Organization Name"
   *               email:
   *                 type: string
   *                 example: "newemail@example.com"
   *               industry:
   *                 type: string
   *                 example: "Tech"
   *               type:
   *                 type: string
   *                 example: "Private"
   *               country:
   *                 type: string
   *                 example: "NGA"
   *               address:
   *                 type: string
   *                 example: "1234 New HNG"
   *               state:
   *                 type: string
   *                 example: "Lagos"
   *               description:
   *                 type: string
   *                 example: "A new description of the organization."
   *     responses:
   *       200:
   *         description: Organization updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "Organisation updated successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     organization_id:
   *                       type: string
   *                       example: "61202249-0bc4-41eb-8cd5-7b873b7c7cc7"
   *                     name:
   *                       type: string
   *                       example: "New Organization Name"
   *                     email:
   *                       type: string
   *                       example: "newemail@example.com"
   *                     industry:
   *                       type: string
   *                       example: "Tech"
   *                     type:
   *                       type: string
   *                       example: "Private"
   *                     country:
   *                       type: string
   *                       example: "NGA"
   *                     address:
   *                       type: string
   *                       example: "1234 New HNG"
   *                     state:
   *                       type: string
   *                       example: "Lagos"
   *                     description:
   *                       type: string
   *                       example: "A new description of the organization."
   *       404:
   *         description: Organization not found
   *       500:
   *         description: Failed to update organization details
   */

  async updateOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.organization_id;
      const payload = req.body;
      const userId = req.user.id;

      const updatedOrganisation =
        await this.orgService.updateOrganizationDetails(orgId, userId, payload);

      const {
        id,
        name,
        email,
        industry,
        type,
        country,
        address,
        state,
        description,
      } = updatedOrganisation;

      const respObj = {
        status: "success",
        status_code: 200,
        message: "Organisation updated successfully",
        data: {
          organization_id: id,
          name,
          email,
          industry,
          type,
          country,
          address,
          state,
          description,
        },
      };

      return res.status(200).json(respObj);
    } catch (error) {
      if (error instanceof ResourceNotFound) {
        next(error);
      } else {
        next(new HttpError(500, "Failed to update organization details"));
      }
    }
  }

  /**
   * @swagger
   * /organizations/accept-invite:
   *   post:
   *     summary: Add user to organization using an invite token
   *     description: Adds a user to an organization using an invite token. The user must be registered to join the organization.
   *     tags: [Organization]
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: The invitation token
   *     responses:
   *       201:
   *         description: User added to organization successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: User added to organization successfully
   *       404:
   *         description: Invalid or expired invite token, or user not registered.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Invalid or expired invite token
   *       409:
   *         description: User already added to organization.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 409
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: User already added to organization
   *       500:
   *         description: An unexpected error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred
   */

  async addUserToOrganizationWithInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.query;
      const userId = req.user.id;
      const message = await this.orgService.addUserToOrganizationWithInvite(
        token as string,
        userId,
      );

      res.status(201).json({ status_code: 201, message: message });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        success: false,
        message: error.message || "An unexpected error occurred",
      });
    }
  }

  /**
   * @swagger
   * /organizations/{org_id}/invite:
   *   get:
   *     summary: Generate a generic invite link for an organization
   *     description: Generate a generic invite link that can be used to invite users to join the specified organization. The invite link is returned for sharing or use in invitation emails.
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
   *         description: Generic invite link generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Invite link generated successfully
   *                 link:
   *                   type: string
   *                   example: "http://example.com/invite?token=abc123"
   *       404:
   *         description: Organization not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Organization with ID {org_id} not found
   *       500:
   *         description: An unexpected error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred
   */

  async generateGenericInviteLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const link = await this.orgService.generateGenericInviteLink(
        req.params.org_id,
      );
      if (link) {
        res.status(200).json({
          status_code: 200,
          message: "Invite link generated successfully",
          link,
        });
      }
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        success: false,
        message: error.message || "An unexpected error occurred",
      });
    }
  }

  /**
   * @swagger
   * /organizations/{org_id}/send-invites:
   *   post:
   *     summary: Generate and send invitation links to emails
   *     description: Generate invitation links for a list of emails and send them to the provided addresses. The invites are associated with the specified organization.
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
   *                 description: The list of email addresses to send invitations to
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
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Invitations successfully sent.
   *       400:
   *         description: Invalid input data, email(s) are required.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Email(s) are required!
   *       404:
   *         description: Organization not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Organization with ID {org_id} not found.
   *       500:
   *         description: An unexpected error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred
   */

  async generateAndSendInviteLinks(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;
      const orgId = req.params.org_id;

      if (!email) {
        throw new InvalidInput("Email(s) are required!");
      }

      const emailList = Array.isArray(email) ? email : [email];
      await this.orgService.generateAndSendInviteLinks(emailList, orgId);
      res
        .status(200)
        .json({ status_code: 200, message: "Invitations successfully sent." });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        success: false,
        message: error.message || "An unexpected error occurred",
      });
    }
  }

  /**
   * @swagger
   * /organizations/invites:
   *   get:
   *     summary: Get all invitation links
   *     description: Retrieve a paginated list of all invitation links.
   *     tags: [Organization]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: The page number to retrieve
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *         description: The number of items per page
   *     responses:
   *       200:
   *         description: Successfully fetched invites
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Successfully fetched invites
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "123"
   *                       token:
   *                         type: string
   *                         example: "abc123token"
   *                       isAccepted:
   *                         type: boolean
   *                         example: false
   *                       isGeneric:
   *                         type: boolean
   *                         example: false
   *                       organization:
   *                         type: string
   *                         example: "Organization Name"
   *                       email:
   *                         type: string
   *                         example: "user@example.com"
   *                 total:
   *                   type: integer
   *                   example: 50
   *                 page:
   *                   type: integer
   *                   example: 1
   *                 pageSize:
   *                   type: integer
   *                   example: 10
   *       500:
   *         description: An unexpected error occurred while processing the request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: An unexpected error occurred
   */

  async getAllInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

      const { status_code, message, data, total } =
        await this.orgService.getAllInvite(page, pageSize);

      res
        .status(200)
        .json({ status_code, message, data, total, page, pageSize });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        success: false,
        message: error.message || "An unexpected error occurred",
      });
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

  /**
   * @swagger
   * /api/v1/organizations/{organizationId}/roles/{roleId}/permissions:
   *   put:
   *     summary: Update permissions for a specific role in an organization
   *     tags: [Roles]
   *     parameters:
   *       - in: path
   *         name: organizationId
   *         required: true
   *         description: The ID of the organization
   *         schema:
   *           type: string
   *           example: "org-12345"
   *       - in: path
   *         name: roleId
   *         required: true
   *         description: The ID of the role within the organization
   *         schema:
   *           type: string
   *           example: "role-67890"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               permissions:
   *                 type: array
   *                 items:
   *                   type: string
   *                   enum:
   *                     - canViewTransactions
   *                     - canViewRefunds
   *                     - canLogRefunds
   *                     - canViewUsers
   *                     - canCreateUsers
   *                     - canEditUsers
   *                     - canBlacklistWhitelistUsers
   *                 example:
   *                   - canViewTransactions
   *                   - canCreateUsers
   *                   - canLogRefunds
   *             required:
   *               - permissions
   *     responses:
   *       200:
   *         description: Permissions updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: object
   *                   description: The updated role object with permissions
   *       400:
   *         description: Bad Request - Missing required parameters or permissions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "OrganizationID and Role ID are required."
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *       404:
   *         description: Not Found - Organization or Role not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Role not found"
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *       500:
   *         description: Internal Server Error - Error updating permissions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Error updating the role permissions of this organization"
   *                 status_code:
   *                   type: integer
   *                   example: 500
   */

  async updateOrganizationRolePermissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const organizationId = req?.params?.org_id || null;
      const roleId = req?.params?.role_id || null;
      const newPermissions: PermissionCategory[] = req.body?.permissions || [];

      if (!(organizationId && roleId)) {
        return res.status(400).json({
          error: "OrganizationID and Role ID are required.",
          status_code: 400,
        });
      }

      if (!newPermissions?.length) {
        return res.status(400).json({
          error: "Permissions are required.",
          status_code: 400,
        });
      }

      const response = await this.orgService.updateRolePermissions(
        roleId,
        organizationId,
        newPermissions,
      );

      return res.status(200).json({
        status_code: 200,
        data: response,
      });
    } catch (error) {
      if (error instanceof ResourceNotFound) {
        next(error);
      }
      next(
        new ServerError(
          "Error updating the role permissions of this organization",
        ),
      );
    }
  }
}
