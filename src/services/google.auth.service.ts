import AppDataSource from "../data-source";
import { User } from "../models";
import { Profile } from "passport-google-oauth2";
import config from "../config";
import jwt from "jsonwebtoken";
import { BadRequest, HttpError } from "../middleware";
import { Profile as UserProfile } from "../models";
import { GoogleUser } from "../types";

interface IGoogleAuthService {
  handleGoogleAuthUser(
    payload: Profile,
    authUser: User | null,
  ): Promise<{
    user: Partial<User>;
    access_token: string;
  }>;
  getUserByGoogleId(google_id: string): Promise<User | null>;
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

        const [first_name, last_name] = name.split(" ");

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
}
