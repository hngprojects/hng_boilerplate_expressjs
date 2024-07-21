import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";
import { User } from "../models";
import {
  HttpError,
  ResourceNotFound,
  ServerError,
  Unauthorized,
} from "./error";

interface UserRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(400, "Bad Request");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Unauthorized("Invalid token");
    }

    const payload = verifyToken(token);

    if (!payload) {
      throw new Unauthorized("Unauthroized");
    }

    const user = await User.findOne({
      where: { email: payload["email"] as string },
    });

    if (!user) {
      throw new ResourceNotFound("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
};
