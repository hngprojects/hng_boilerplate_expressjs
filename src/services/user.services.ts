import { User } from "../models/user";
import { Organization } from "../models/organization";
import { IUserService } from "../types";

export class UserService implements IUserService {
  public async getUserById(id: string): Promise<User | null> {
    const user = await User.findOne({
      where: { id },
      relations: ["profile", "products", "organizations"],
    });
    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await User.find({
      relations: ["profile", "products", "organizations"],
    });
    return users;
  }

  // New method to get organizations for a user with pagination
  public async getUserOrganizations(userId: string, page: number, limit: number) {
    const user = await User.findOne({
      where: { id: userId },
      relations: ["organizations"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const [organizations, totalItems] = await Organization.createQueryBuilder("organization")
      .innerJoin("organization.users", "user", "user.id = :userId", { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      organisations: organizations,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        page_size: limit,
      },
    };
  }
}
