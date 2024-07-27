import AppDataSource from "../data-source";
import { User } from "../models";
import { Profile } from "passport-google-oauth2";
import config from "../config";
import jwt from "jsonwebtoken";
import { HttpError } from "../middleware";
import { Profile as UserProfile } from "../models";

interface IGoogleAuthService {
  handleGoogleAuthUser(
    payload: Profile,
    authUser: User | null,
  ): Promise<{
    status: string;
    message: string;
    user: Partial<User>;
    access_token: string;
  }>;
  getUserByGoogleId(google_id: string): Promise<User | null>;
}

export class GoogleAuthService implements IGoogleAuthService {
  public async handleGoogleAuthUser(
    payload: Profile,
    authUser: User | null,
  ): Promise<{
    status: string;
    message: string;
    user: Partial<User>;
    access_token: string;
  }> {
    try {
      let user: User;
      let profile: UserProfile;
      if (!authUser) {
        user = new User();
        profile = new UserProfile();
      } else {
        user = authUser;
        profile = user.profile;
      }

      user.name = payload.displayName;
      user.email = payload.email;
      user.google_id = payload.id;
      user.otp = 1234;
      user.isverified = true;
      user.otp_expires_at = new Date(Date.now());
      profile.phone = "";
      profile.first_name = payload.given_name;
      profile.last_name = payload.family_name;
      profile.avatarUrl = payload.picture;
      user.profile = profile;

      const createdUser = await AppDataSource.manager.save(user);
      const access_token = jwt.sign(
        { userId: createdUser.id },
        config.TOKEN_SECRET,
        {
          expiresIn: "1d",
        },
      );

      const { password: _, ...rest } = createdUser;

      return {
        status: "success",
        message: "User successfully authenticated",
        access_token,
        user: rest,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async getUserByGoogleId(google_id: string): Promise<User | null> {
    try {
      return AppDataSource.getRepository(User).findOne({
        where: { google_id },
        relations: ["profile"],
      });
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
