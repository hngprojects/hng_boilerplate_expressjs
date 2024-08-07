import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums/userRoles";
import { Unauthorized } from "./error";
import { User } from "../models";
import AppDataSource from "../data-source";
import jwt from "jsonwebtoken";

export const checkPermissions = (roles: UserRole[]) => {
  return async (
    req: Request & { user?: User },
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.decode(token);
      if (typeof decodedToken === "string" || !decodedToken) {
        return res
          .status(401)
          .json({ status: "error", message: "Access denied. Invalid token" });
      }
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decodedToken.userId },
      });

      if (!user || !roles.includes(user.role)) {
        return res
          .status(403)
          .json({ status: "error", message: "Access denied. Not an admin" });
      }
      next();
    } catch (error) {
      res
        .status(401)
        .json({ status: "error", message: "Access denied. Invalid token" });
    }
  };
};

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user || user.role !== UserRole.ADMIN) {
    return next(new Unauthorized("Access denied. Admins only."));
  }
  next();
}
