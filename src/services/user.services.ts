// src/services/UserService.ts
import { User } from "../models/user";
import { IUserService } from "../types";
import { HttpError } from "../middleware";
import { Repository, UpdateResult } from 'typeorm';
import AppDataSource from '../data-source';

export class UserService implements IUserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }
  
  static async getUserById(id: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({
      where: { id },
      relations: ["profile"],
      withDeleted: true,
    });
  }

  public async softDeleteUser(id:string):Promise<UpdateResult> {
    const user = await this.userRepository.findOne({where: {id}});

    if (!user) {
      throw new HttpError(404, "User Not Found");
    }
    
    user.is_deleted = true; 
    await this.userRepository.save(user);
    const deletedUser = await this.userRepository.softDelete({id});
    return deletedUser;
  }
}

export { UserService };
