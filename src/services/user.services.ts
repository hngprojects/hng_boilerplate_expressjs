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
}

export { UserService };
