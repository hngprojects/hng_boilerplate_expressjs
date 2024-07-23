import AppDataSource from "../data-source";
import { User } from "../models";

class UserService {
  static async getUserById(id: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({
      where: { id },
      relations: ["profile"],
      withDeleted: true,
    });
  }

  public async deleteUserById(id: string): Promise<void> {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    await User.remove(user);
  }
}

export { UserService };
