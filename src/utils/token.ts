import * as jwt from "jsonwebtoken";
import config from "../config";

export async function generateAccessToken(user) {
  return jwt.sign(user, config.TOKEN_SECRET, { expiresIn: "1h" });
}