import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";
import { User } from "../models/user";

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  public async getUserById(id: string): Promise<User | null> {
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
