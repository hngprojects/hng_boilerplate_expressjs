import { Repository } from "typeorm";
import { User, Profile } from "../models";
import AppDataSource from "../data-source";
import { HttpError, ResourceNotFound } from "../middleware";
import { cloudinary } from "../config/multer";
import { IUserProfileUpdate } from "../types";

export class UserService {
  private userRepository: Repository<User>;
  private profileRepository: Repository<Profile>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.profileRepository = AppDataSource.getRepository(Profile);
  }

  public async updateUserProfile(id: string, payload: IUserProfileUpdate, file: Express.Multer.File): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ["profile"],
      });

      if (!user) {
        throw new ResourceNotFound("User not found");
      }

      const userUpdates: Partial<User> = {};
      if (payload.first_name) userUpdates.first_name = payload.first_name;
      if (payload.last_name) userUpdates.last_name = payload.last_name;
      if (payload.phone) userUpdates.phone = payload.phone;

      const profileUpdates: Partial<Profile> = {};
      if (payload.username) profileUpdates.username = payload.username;
      if (payload.jobTitle) profileUpdates.jobTitle = payload.jobTitle;
      if (payload.pronouns) profileUpdates.pronouns = payload.pronouns;
      if (payload.department) profileUpdates.department = payload.department;
      if (payload.bio) profileUpdates.bio = payload.bio;
      if (payload.social_links) profileUpdates.social_links = payload.social_links;
      if (payload.language) profileUpdates.language = payload.language;
      if (payload.region) profileUpdates.region = payload.region;
      if (payload.timezones) profileUpdates.timezones = payload.timezones;

      if (file) {
        const oldImageUrl = user.profile.profile_pic_url;
        if (oldImageUrl) {
          const publicId = oldImageUrl.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const { secure_url } = await cloudinary.uploader.upload(file.path);
        profileUpdates.profile_pic_url = secure_url;
      }

      await this.userRepository.update(user.id, userUpdates);
      await this.profileRepository.update(user.profile.id, profileUpdates);

      const updatedUser = await this.userRepository.findOne({
        where: { id },
        relations: ["profile"],
      });

      if (updatedUser) {
        delete updatedUser.password;
      }

      return updatedUser as User;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
