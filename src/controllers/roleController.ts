import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { UserRole } from "../enums/userRoles";
import { ResourceNotFound, HttpError } from "../middleware/error";
import { createRole } from "../services/role.services";

export const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, organization_id } = req.params;
    const { new_role } = req.body;

    // Validate the provided role
    if (!Object.values(UserRole).includes(new_role)) {
      throw new HttpError(400, "Invalid role specified");
    }

    // Retrieve the user whose role needs to be updated
    const user = await User.findOne({
      where: { id: user_id },
      relations: ["organizations"],
    });

    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    // Check if the user belongs to the specified organization
    const userOrganization = user.organizations.find(
      (org) => org.id === organization_id,
    );

    if (!userOrganization) {
      throw new HttpError(400, "User does not belong to the specified team");
    }

    // Update the user's role
    user.role = new_role;
    await user.save();

    res.status(200).json({
      message: "Team member role updated successfully",
      organization_id,
      user_id,
      new_role,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role for a user
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_role
 *             properties:
 *               new_role:
 *                 type: string
 *                 description: The new role to be assigned to the user
 *     responses:
 *       200:
 *         description: User role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User role created successfully
 *                 user_id:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 new_role:
 *                   type: string
 *                   example: super_admin
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export const createUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const { new_role } = req.body;

    const updatedUser = await createRole(userId, new_role);

    res.status(200).json({
      message: "User role created successfully",
      user_id: updatedUser.id,
      new_role: updatedUser.role,
    });
  } catch (error) {
    next(error);
  }
};
