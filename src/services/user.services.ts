import AppDataSource from "../data-source";
import { User } from "../models";
import { Profile } from "../models/profile";
import { cloudinary } from "../config/multer";

interface IUserProfileUpdate {
  first_name: string;
  last_name: string;
  phone: string;
  avatarUrl: string;
}

class UserService {
  static async getUserById(id: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({
      where: { id },
      relations: ["profile"],
      withDeleted: true,
    });
  }

  static async updateUserProfile(
    id: string,
    payload: IUserProfileUpdate,
    file?: Express.Multer.File
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
        phone: payload.phone,
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
        user.name = `${updatedProfile?.first_name} ${updatedProfile?.last_name}`;
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

export { UserService };
