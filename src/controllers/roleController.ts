import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { UserRole } from "../enums/userRoles";
import { ResourceNotFound, HttpError } from "../middleware/error";

export const changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, organization_id } = req.params;
    const { new_role } = req.body;

    // Validate the provided role
    if (!Object.values(UserRole).includes(new_role)) {
      throw new HttpError(400, "Invalid role specified");
    }

    // Retrieve the user whose role needs to be updated
    const user = await User.findOne({ where: { id: user_id }, relations: ["organizations"] });

    if (!user) {
      throw new ResourceNotFound("User not found");
    }

      // Check if the user belongs to the specified organization
      const userOrganization = user.organizations.find(org => org.id === organization_id);

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
        new_role
      });
  } catch (error) {
    next(error);
  }
};
