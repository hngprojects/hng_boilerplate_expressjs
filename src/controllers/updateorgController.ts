import { Request, Response } from "express";
import { UpdateOrganizationDetails } from "../services/updateorg.service";

/**
 * @swagger
 * /organization/{organization_id}:
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

export const updateOrganization = async (req: Request, res: Response) => {
  const { organization_id } = req.params;
  const updateData = req.body;

  try {
    const organization = await UpdateOrganizationDetails(
      organization_id,
      updateData,
    );
    return res.status(200).json({
      message: "Organization details updated successfully",
      status_code: 200,
      data: organization,
    });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        status: "unsuccessful",
        status_code: 404,
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "failed",
        status_code: 500,
        message:
          "Failed to update organization details. Please try again later.",
      });
    }
  }
};
