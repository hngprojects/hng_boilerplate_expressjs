import { Request, Response } from "express";
import { searchOrganizationMembersService } from "../services/SearchMembersServices";

/**
 * @swagger
 * /api/v1/members/search:
 *   get:
 *     summary: Search for organization members by name or email
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the member
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email of the member
 *     responses:
 *       200:
 *         description: List of organizations with members matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   organizationId:
 *                     type: string
 *                   organizationName:
 *                     type: string
 *                   organizationEmail:
 *                     type: string
 *                   members:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                         userName:
 *                           type: string
 *                         userEmail:
 *                           type: string
 *       400:
 *         description: At least one search criterion (name or email) must be provided.
 *       404:
 *         description: No members found matching the search criteria.
 *       500:
 *         description: An error occurred while searching for members.
 */

export const searchOrganizationMembers = async (req: Request, res: Response) => {
    const { name, email } = req.query;
    if (!name && !email) {
        return res.status(400).json({ error: "At least one search criterion (name or email) must be provided.", status_code: "400" });
    };

    try {
        const result: any = await searchOrganizationMembersService({ name: as string, email: as string });
        if (result) {
            return res.status(200).json({ result: result, status_code: 200 });
        } else {
            return res.status(404).json({ error: "No members found matching the search criteria.", status_code: 404 });
        }
    } catch (err) {
        res.status(500).json({ error: "An error occurred while searching for members.", status_code: 500 });
    }
};
