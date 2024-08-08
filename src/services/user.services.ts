import { Repository, UpdateResult } from "typeorm";
import AppDataSource from "../data-source";
import { BadRequest, HttpError, ResourceNotFound } from "../middleware";
import { User } from "../models/user";
import { UpdateUserRecordOption, UserIdentifierOptionsType } from "../types";
import { comparePassword } from "../utils";
import { Profile } from "../models";
import { cloudinary } from "../config/multer";

interface IUserProfileUpdate {
  first_name: string;
  last_name: string;
  phone_number: string;
  avatarUrl: string;
}

interface TimezoneData {
  timezone: string;
  gmtOffset: string;
  description: string;
}

export class UserService {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["profile"],
      withDeleted: true,
    });

    if (!user) {
      throw new ResourceNotFound("User Not Found!");
    }

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

  async getUserByEmail(
    email: string,
    withDeleted: boolean = true,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["profile"],
      withDeleted: withDeleted,
    });

    if (!user) throw new ResourceNotFound("User not found!");

    return user;
  }

  async updateUserRecord(userUpdateOptions: UpdateUserRecordOption) {
    const { identifierOption, updatePayload } = userUpdateOptions;
    const user = await this.getUserRecord(identifierOption);
    Object.assign(user, updatePayload);
    await this.userRepository.save(user);
  }

  async getUserRecord(
    identifierOption: UserIdentifierOptionsType,
  ): Promise<User> {
    const { identifier, identifierType } = identifierOption;
    let user = null;
    switch (identifierType) {
      case "id":
        user = await this.getUserById(identifier);
        break;
      case "email":
        user = await this.getUserByEmail(identifier);
        break;
      default:
        throw new BadRequest("Invalid Identifier");
    }
    if (!user) throw new ResourceNotFound("User not found!");
    return user;
  }

  async compareUserPassword(password: string, hashedPassword: string) {
    return comparePassword(password, hashedPassword);
  }

  public async updateUserTimezone(
    userId: string,
    timezoneData: TimezoneData,
  ): Promise<User> {
    const { timezone, gmtOffset, description } = timezoneData;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    user.timezone = { timezone, gmtOffset, description };
    await this.userRepository.save(user);
    return user;
  }
}
