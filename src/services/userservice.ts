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
}
