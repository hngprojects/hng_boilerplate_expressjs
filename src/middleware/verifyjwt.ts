import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import createHttpError from "http-errors";
import { UserRole } from "../enums/userRoles";

interface DecodedToken {
  userId: string;
  role?: UserRole;
}

interface VerifyRequest extends Request {
  user?: {
    userId: string;
  };
}

const verifyJWT = (req: VerifyRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(createHttpError(401, "Authorization header missing"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createHttpError(401, "Auth Token missing"));
  }

  jwt.verify(token, config.TOKEN_SECRET, (err, decoded: DecodedToken) => {
    if (err) {
      return next(createHttpError(403, "Invalid or expired auth token"));
    }

    req.user = { userId: decoded.userId };
    next();
  });
};

export { verifyJWT };
