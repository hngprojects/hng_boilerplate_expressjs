import * as bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import config from "../config";

export const getIsInvalidMessage = (fieldLabel: string) =>
  `${fieldLabel} is invalid`;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
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

export const generateToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): Record<string, unknown> | null => {
  try {
    const payload = jwt.verify(token, config.TOKEN_SECRET);
    return payload as Record<string, unknown>;
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
