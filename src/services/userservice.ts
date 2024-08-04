import { User } from "../models/user";
import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";

export class UserService {
  static async getUserById(id: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      relations: ["profile"],
      withDeleted: true,
    });

    if (!user) {
      throw new ResourceNotFound("User Not Found!");
    }

    return user;
  }

  static async updateUserById(
    id: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOne({
      where: { id },
      relations: ["profile"],
    });

    if (!user) {
      throw new ResourceNotFound("User Not Found!");
    }

    // Update user fields with provided data
    if (user.profile) {
      Object.assign(user.profile, updateData.profile);
      await userRepository.save(user.profile);
    }
    Object.assign(user, updateData);

    // Save updated user to the database
    await userRepository.save(user);

    return user;
  }
}
