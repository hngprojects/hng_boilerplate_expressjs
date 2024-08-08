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
  /**
   * @openapi
   * /api/v1/squeeze/{id}:
   *   get:
   *     tags:
   *       - Squeeze
   *     summary: Get a squeeze record by ID
   *     description: Retrieve a single squeeze entry from the database by its ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the squeeze record to retrieve
   *     responses:
   *       200:
   *         description: Squeeze record found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *                 first_name:
   *                   type: string
   *                 last_name:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 location:
   *                   type: string
   *                 job_title:
   *                   type: string
   *                 company:
   *                   type: string
   *                 interests:
   *                   type: array
   *                   items:
   *                     type: string
   *                 referral_source:
   *                   type: string
   *       404:
   *         description: Squeeze record not found
   *       500:
   *         description: Server error
   */

  public getSqueezeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const squeeze = await this.squeezeService.getSqueezeById(id);

      if (!squeeze) {
        return res.status(404).json({
          status: "error",
          message: "Squeeze record not found.",
        });
      }

      res.status(200).json({
        status: "success",
        data: squeeze,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "An error occurred while retrieving the squeeze record.",
        error: error.message,
      });
    }
  };
}

export { SqueezeController };
