// src/services/UserService.ts
import { User } from "../models/user";
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

  public async deleteUserById(id: string): Promise<void> {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    await User.remove(user);
  }
}
