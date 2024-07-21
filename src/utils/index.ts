import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from "../config";

export const getIsInvalidMessage = (fieldLabel: string) =>
  `${fieldLabel} is invalid`;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateAccessToken(user_id: string) {
  return jwt.sign({ user_id }, config.TOKEN_SECRET, { expiresIn: "1d" });
}

export const generateNumericOTP = (length: number): string => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 9 + 1).toString();
  }
  return otp;
};
