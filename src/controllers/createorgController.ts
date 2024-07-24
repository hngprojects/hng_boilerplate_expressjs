import { NextFunction, Request, Response } from "express";
import { OrganisationService } from "../services/createOrg.services";

/**
 * @swagger
 * /organisation:
 *   post:
 *     summary: Create a new organisation
 *     description: This endpoint allows a user to create a new organisation
 *     tags:
 *       - Organisation
 *     operationId: createOrganisation
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
 *             required:
 *               - name
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
 */

export const createOrganisation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body;
    const user = req.user;
    const userId = user.id;

    const organisationService = new OrganisationService();
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
    return next(error);
  }
};
