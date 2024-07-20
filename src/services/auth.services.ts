import * as bcrypt from "bcryptjs"
import { AppDataSource } from "../data-source";
import { User, Profile } from "../models"
import { Request, Response } from "express";
import { generateAccessToken } from "../utils/token";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone, role } = req.body;
  
  const findUser = await AppDataSource.manager.find(email);
  if (findUser) {
    return res.status(422).json({
      statusCode: 422,
      message: "User already exists"
    })
  }
  
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const access_token = await generateAccessToken(email);

  const user = new User();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.password = hashedPassword;
  user.profile = new Profile();
  user.profile.phone = phone;
  user.profile.first_name = firstName;
  user.profile.last_name = lastName;
  user.role = role;

  const userProfile = await AppDataSource.manager.save({
    user,
  });

  const data = {
    user_id: userProfile.user.id,
    first_name: userProfile.user.name[0],
    last_name: userProfile.user.name[1],
    email: userProfile.user.email,
    phone: userProfile.user.profile.phone,
    role: userProfile.user.role,
    access_token: access_token,
  }

  return res.status(201).json({data});
}
