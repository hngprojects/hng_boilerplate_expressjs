import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import { UserRequest } from "../types";

interface DecodedToken {
  user_id: string;
}

const verifyJWT = (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Auth Token missing" });
  }

  jwt.verify(token, config.TOKEN_SECRET, (err, decoded: DecodedToken) => {
    if (err) {
      return res.status(403).json({ error: "Invalid  or expired auth token" });
    }
    req.user = {
      user_id: decoded.user_id,
    };
    next();
  });
};

export { verifyJWT };
