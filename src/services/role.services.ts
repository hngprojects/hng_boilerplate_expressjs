import { User } from "../models";
import { UserRole } from "../enums/userRoles";
import { HttpError } from "../middleware/error";

export const createRole = async (
  userId: string,
  newRole: UserRole,
): Promise<User> => {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (!Object.values(UserRole).includes(newRole)) {
      throw new HttpError(400, "Invalid role specified");
    }

    user.role = newRole;
    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};
