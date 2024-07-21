// src/services/UserService.ts
import { User } from "../models/user";
import { AppDataSource } from "../data-source";
import { IUserService, IUserUpdatePayload } from "../types";

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


  public async updateUserProfile(
    userId: string,
    updates: IUserUpdatePayload
  ): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return null;
    }

    if (updates.email && updates.email !== user.email) {
      const emailExists = await userRepository.findOneBy({ email: updates.email });
      if (emailExists) {
        throw new Error("Email address already in use");
      }
      // Trigger email verification process if needed
    }

    Object.assign(user, updates);

    await userRepository.save(user);
    return user;
  }
}
