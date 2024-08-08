import { Request, Response } from "express";
import { SqueezeService } from "../services";

class SqueezeController {
  private squeezeService: SqueezeService;

  constructor() {
    this.squeezeService = new SqueezeService();
  }

  /**
   * @openapi
   * /api/v1/squeeze-pages:
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
  public createSqueeze = async (req: Request, res: Response) => {
    try {
      const squeezeData = req.body;
      const squeeze = await this.squeezeService.createSqueeze(squeezeData); // Use the instance method
      res.status(201).json({
        status: "success",
        message: "Squeeze record created successfully.",
        data: squeeze,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "An error occurred while creating the squeeze record.",
        error: error.message,
      });
    }
  };
}

export { SqueezeController };
