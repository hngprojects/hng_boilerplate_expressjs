import config from "../config/index";
import AppDataSource from "../data-source";
import { BadRequest, HttpError } from "../middleware";
import { User, Profile } from "../models";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { FacebookUser, IFacebookAuthService } from "../types";
import { generateNumericOTP } from "../utils";

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "emails", "name", "photos"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any,
    ) => {
      try {
        const facebookAuthService = new FacebookAuthService();
        const payload = {
          id: profile.id,
          first_name: profile.name.givenName || "",
          last_name: profile.name.familyName || "",
          email: profile.emails?.[0]?.value,
          verified: profile.verified || true,
          picture: profile.photos?.[0]?.value || "",
        };
        const user = await facebookAuthService.getUserByFacebookId(payload.id);
        const result = await facebookAuthService.facebookUserAuth(
          payload,
          user,
        );
        return done(null, result, accessToken);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export class FacebookAuthService implements IFacebookAuthService {
  public async getUserByFacebookId(facebook_id: string): Promise<User | null> {
    try {
      return await AppDataSource.getRepository(User).findOne({
        where: { facebook_id },
        relations: ["profile"],
      });
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async facebookUserAuth(
    payload: FacebookUser,
    authUser: User | null,
  ): Promise<{
    user: Partial<User>;
  }> {
    try {
      const { id, first_name, last_name, email, verified, picture } = payload;

      let facebookUser: User;

      if (!authUser && email) {
        const user = new User();
        const profile = new Profile();

        user.name = `${first_name} ${last_name}`;
        user.email = email;
        user.facebook_id = id;
        user.isverified = verified;
        user.otp = Number(generateNumericOTP(6));
        user.otp_expires_at = new Date(Date.now());
        user.createdAt = new Date(Date.now());
        user.updatedAt = user.createdAt;
        profile.first_name = first_name;
        profile.last_name = last_name;
        profile.avatarUrl = picture;
        user.profile = profile;

        facebookUser = await AppDataSource.manager.save(user);
      } else if (!email) {
        throw new BadRequest("Invalid email. Email is required");
      } else {
        facebookUser = authUser;
      }
      const {
        password: _,
        otp: __,
        otp_expires_at: ___,
        google_id: ____,
        ...rest
      } = facebookUser;
      return { user: rest };
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
