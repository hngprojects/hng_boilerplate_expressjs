import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";

interface AuthenticatedUserRequest extends Request {
  user?: User;
}

declare interface ErrorResponseData {
  status: string;
  message: string;
  status_code: number;
}

type AuthenticatedUserResponse = Response<ErrorResponseData>;

export const authMiddleware = async (
  req: AuthenticatedUserRequest,
  res: AuthenticatedUserResponse,
  next: NextFunction
): Promise<AuthenticatedUserResponse | void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ status: "Bad Request", message: "Bad Request", status_code: 400 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: "Unauthorized", message: "Invalid token", status_code: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ status: "Unauthorized", message: "Unauthorized", status_code: 401 });
    }

    const user = await User.findOne({ where: { email: payload["email"] as string } });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found", status_code: 404 });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: "INTERNAL_SERVER_ERROR", message: "INTERNAL_SERVER_ERROR", status_code: 500 });
  }
};
