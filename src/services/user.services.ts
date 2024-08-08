// src/services/UserService.ts
import { Repository, UpdateResult } from "typeorm";
import { cloudinary } from "../config/multer";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import { Profile } from "../models/profile";
import { User } from "../models/user";

interface IUserProfileUpdate {
  first_name: string;
  last_name: string;
  phone_number: string;
  avatarUrl: string;
}

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  static async getUserById(id: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.findOne({
      where: { id },
      relations: ["profile"],
      withDeleted: true,
    });
    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await User.find({
      relations: ["profile", "products", "organizations"],
    });
    return users;
  }

  public async softDeleteUser(id: string): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    user.is_deleted = true;
    await this.userRepository.save(user);
    const deletedUser = await this.userRepository.softDelete({ id });
    return deletedUser;
  }

  public async updateUserProfile(
    id: string,
    payload: IUserProfileUpdate,
    file?: Express.Multer.File,
  ): Promise<User | null> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const profileRepository = AppDataSource.getRepository(Profile);

      const user = await userRepository.findOne({
        where: { id },
        relations: ["profile"],
      });

      if (!user) {
        throw new Error("User not found");
      }

      const profile: Partial<Profile> = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone_number: payload.phone_number,
        avatarUrl: file ? file.path : undefined,
      };

      const userProfile = await profileRepository.findOne({
        where: { id: user.profile.id },
      });

      if (!userProfile) {
        throw new Error("Profile not found");
      }

      if (file) {
        // delete old image from cloudinary
        const oldImage = userProfile.avatarUrl;
        if (oldImage) {
          const publicId = oldImage.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        // upload new image to cloudinary
        const { path } = file;
        const result = await cloudinary.uploader.upload(path);
        userProfile.avatarUrl = result.secure_url;
      }

      await profileRepository.update(userProfile.id, profile);

      user.profile = userProfile;

      await userRepository.update(user.id, user);

      if (profile.first_name || profile.last_name) {
        const updatedProfile = await profileRepository.findOne({
          where: { id: user.profile.id },
        });
        if (updatedProfile) {
          user.name = `${updatedProfile.first_name} ${updatedProfile.last_name}`;
        }
        // user.name = `${payload.first_name} ${payload.last_name}`;
        await userRepository.update(user.id, user);
      }

      const updatedUser = await userRepository.findOne({
        where: { id },
        relations: ["profile"],
      });

      // remove password from response
      if (updatedUser) {
        delete updatedUser.password;
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
