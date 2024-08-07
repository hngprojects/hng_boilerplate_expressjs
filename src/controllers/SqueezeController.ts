import { Request, Response } from "express";
import { SqueezeService } from "../services";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

class SqueezeController {
  /**
   * @openapi
   * tags:
   *   - name: Squeeze
   *     description: Squeeze API related routes
   */
  /**
   * @openapi
   * /api/v1/squeeze:
   *   post:
   *     tags:
   *       - Squeeze
   *     summary: Create a new squeeze
   *     description: Create a new squeeze entry.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               phone:
   *                 type: string
   *               location:
   *                 type: string
   *               job_title:
   *                 type: string
   *               company:
   *                 type: string
   *               interests:
   *                 type: array
   *               referral_source:
   *                 type: string
   *             required:
   *               - email
   *               - first_name
   *               - last_name
   *     responses:
   *       201:
   *         description: Squeeze created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Squeeze created successfully"
   *                 data:
   *                   type: object
   *       400:
   *         description: Bad request
   *       409:
   *         description: Conflict
   */
  public createSqueeze = asyncHandler(async (req: Request, res: Response) => {
    const squeezeData = req.body;
    const squeeze = await SqueezeService.createSqueeze(squeezeData);
    sendJsonResponse(res, 201, "Squeeze record created successfully.", squeeze);
  });

  /**
   * @openapi
   * /api/v1/squeeze/{email}:
   *   put:
   *     tags:
   *       - Squeeze
   *     summary: Update an existing squeeze
   *     description: Update a squeeze entry by email.
   *     parameters:
   *       - in: path
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               phone:
   *                 type: string
   *               location:
   *                 type: string
   *               job_title:
   *                 type: string
   *               company:
   *                 type: string
   *               interests:
   *                 type: array
   *               referral_source:
   *                 type: string
   *     responses:
   *       200:
   *         description: Squeeze updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Squeeze updated successfully"
   *                 data:
   *                   type: object
   *       400:
   *         description: Bad request
   *       404:
   *         description: Resource not found
   */
  public updateSqueeze = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    const updateData = req.body;
    const squeeze = await SqueezeService.updateSqueeze(email, updateData);
    sendJsonResponse(
      res,
      200,
      "Your record has been successfully updated. You cannot update it again.",
      squeeze,
    );
  });
}

export { SqueezeController };
