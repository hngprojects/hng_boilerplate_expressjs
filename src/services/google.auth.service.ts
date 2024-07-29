import AppDataSource from "../data-source";
import { User } from "../models";
import { Profile } from "passport-google-oauth2";
import config from "../config";
import jwt from "jsonwebtoken";
import { BadRequest, HttpError } from "../middleware";
import { Profile as UserProfile } from "../models";
import { GoogleUser } from "../types";
import { getRepository } from "typeorm";

interface IGoogleAuthService {
  handleGoogleAuthUser(
    payload: Profile,
    authUser: User | null,
  ): Promise<{
    user: Partial<User>;
    access_token: string;
  }>;
  getUserByGoogleId(google_id: string): Promise<User | null>;
  handleGoogleAuth(
    payload: Profile,
    authUser: User | null,
  ): Promise<{
    user: Partial<User>;
    access_token: string;
  }>;
}

export class GoogleAuthService implements IGoogleAuthService {
  public async handleGoogleAuthUser(
    payload: GoogleUser,
    authUser: null | User,
  ): Promise<{
    user: Partial<User>;
    access_token: string;
  }> {
    try {
      const { email, email_verified, name, picture, sub } = payload;
      let user: User;
      let profile: UserProfile;
      let googleUser: User;
      if (!authUser) {
        user = new User();
        profile = new UserProfile();

        const [first_name = "", last_name = ""] = name.split(" ");

        user.name = `${first_name} ${last_name}`;
        user.email = email;
        user.google_id = sub;
        user.otp = 1234;
        user.isverified = email_verified;
        user.otp_expires_at = new Date(Date.now());
        profile.phone_number = "";
        profile.first_name = first_name;
        profile.last_name = last_name;
        profile.avatarUrl = picture;
        user.profile = profile;

        googleUser = await AppDataSource.manager.save(user);
      } else {
        if (authUser.email !== payload.email) {
          throw new BadRequest(
            "The google id is not assigned to this gmail profile",
          );
        }
        googleUser = authUser;
      }

      const access_token = jwt.sign(
        { userId: googleUser.id },
        config.TOKEN_SECRET,
        {
          expiresIn: "1d",
        },
      );

      const { password: _, ...rest } = googleUser;

      return {
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

  public async handleGoogleAuth(
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
      profile.phone_number = "";
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
}

export async function GoogleUserInfo(userInfo: any) {
  const { sub: google_id, email, name, picture } = userInfo;
  // const userRepository = getRepository(User);

  let user = await AppDataSource.getRepository(User).findOne({
    where: { google_id },
  });

  if (!user) {
    user = new User();
    user.google_id = google_id;
    user.email = email;
    user.name = name;
    user.profile.avatarUrl = picture;
  }

  await AppDataSource.manager.save(user);
  return user;
}
