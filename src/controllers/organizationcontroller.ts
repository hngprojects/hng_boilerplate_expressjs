import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { exportService } from "../services"; // Adjust path as necessary

/**
 * @swagger
 * /api/v1/organisation/members/export:
 *   get:
 *     summary: Export signed-in user information
 *     tags: [Export user data by csv or pdf format]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, pdf]
 *         required: true
 *         description: The format to export the user data in.
 *     responses:
 *       200:
 *         description: User data exported successfully.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid format.
 *       401:
 *         description: Unauthorized. No token provided or token is invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 *     security:
 *       - bearerAuth: []
 */

class exportController {
  static exportData = asyncHandler(async (req: Request, res: Response) => {
    const format = req.query.format as string;
    const userId = req.user.id;

    const user = await exportService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = [user];

    if (format === "csv") {
      const csv = exportService.generateCSV(users);
      res.header("Content-Type", "text/csv");
      res.attachment("users.csv");
      return res.send(csv);
    } else if (format === "pdf") {
      const pdf = await exportService.generatePDF(users);
      res.header("Content-Type", "application/pdf");
      res.attachment("users.pdf");
      return res.send(pdf);
    } else {
      return res.status(400).send("Invalid format");
    }
  });
}

export { exportController };
