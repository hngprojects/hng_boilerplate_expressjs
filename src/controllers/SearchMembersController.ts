import { Request, Response } from "express";
import { searchOrganizationMembersService } from "../services/SearchMembersServices";

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

export const searchOrganizationMembers = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    if (!name && !email) {
        return res.status(400).json({ error: "At least one search criterion (name or email) must be provided.", status_code: "400" });
    };

    try {
        const result: any = await searchOrganizationMembersService({ name, email });
        if (result) {
            return res.status(200).json({ result: result, status_code: 200 });
        } else {
            return res.status(404).json({ error: "No members found matching the search criteria.", status_code: 404 });
        }
    } catch (err) {
        res.status(500).json({ error: "An error occurred while searching for members.", status_code: 500 });
    }
};