import Router from "express";
import { OrgController } from "../controllers/OrgController";
import { authMiddleware, checkPermissions } from "../middleware";
import { UserRole } from "../enums/userRoles";
import { organizationValidation } from "../middleware/organization.validation";
import { validateOrgId } from "../middleware/organization.validation";

const orgRouter = Router();
const orgController = new OrgController();

orgRouter.get(
  "/organisations/:org_id",
  authMiddleware,
  validateOrgId,
  orgController.getSingleOrg.bind(orgController),
);
orgRouter.delete(
  "/organisations/:org_id/user/:user_id",
  orgController.removeUser.bind(orgController),
);

orgRouter.post(
  "/organisations",
  authMiddleware,
  organizationValidation,
  orgController.createOrganisation.bind(orgController),
);
orgRouter.post(
  "/organisations/join",
  authMiddleware,
  orgController.joinOrganization.bind(orgController),
);
orgRouter.get(
  "/users/:id/organisations",
  authMiddleware,
  orgController.getOrganizations.bind(orgController),
);

export { orgRouter };

/**
 * @swagger
 * /api/v1/organisations/join:
 *   post:
 *     summary: Add user to organisation by invitation
 *     tags: [Organisation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inviteToken:
 *                 type: string
 *                 description: Invitation token
 *                 example: "valid-token"
 *     responses:
 *       200:
 *         description: User successfully added to organization
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
 *                   example: "User successfully added to the organization."
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unsuccessful"
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired invitation."
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unsuccessful"
 *                 status_code:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "User is already a member of the organization."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unsuccessful"
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
