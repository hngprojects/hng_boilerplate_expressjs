import AppDataSource from "../data-source";
import { Profile, User } from "../models";

export async function GoogleUserInfo(userInfo: any) {
  const { sub: google_id, email, name, picture, email_verified } = userInfo;

  // const userRepository = getRepository(User);

  let user = await AppDataSource.getRepository(User).findOne({
    where: { email },
    relations: ["profile"],
  });

  const [first_name = "", last_name = ""] = name.split(" ");

  if (!user) {
    user = new User();
    user.google_id = google_id;
    user.email = email;
    user.name = name;
    user.isverified = email_verified;
    user.profile = new Profile();
    user.profile.first_name = first_name;
    user.profile.last_name = last_name;
    user.profile.avatarUrl = picture;
  }

  await AppDataSource.manager.save(user);
  const {
    password: _,
    otp: __,
    otp_expires_at,
    createdAt,
    updatedAt,
    deletedAt,
    ...rest
  } = user;
  return rest;
}
