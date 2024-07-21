import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { AppDataSource } from "../data-source";
import { Profile, User } from "../models";
import { Router } from "express";
import { Request, Response } from "express";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: `${process.env.FB_CALLBACK_URL}`,
      profileFields: ["id", "email", "displayName", "gender"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      let user = await User.findOne({
        where: { email: profile._json.email },
      });
      if (user) return cb(null, user);

      const [fbFirstName, fbLastName] = profile._json.name.split(" ");
      user = new User();
      user.facebookId = profile._json.id;
      user.name = profile._json.name;
      user.email = profile._json.email;
      user.profile = new Profile();
      user.profile.first_name = fbFirstName;
      user.profile.last_name = fbLastName;
      user.profile.avatarUrl = "";
      user = await AppDataSource.manager.save(user);

      return cb(null, user);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findOne({ where: { facebookId: id } });
  cb(null, id);
}); // add faceboOkId to user;

const passportRoute = Router();

passportRoute.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

passportRoute.get(
  "/auth/facebook/continue",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect home.
    res.redirect("/continue");
  }
);

export { passportRoute };
