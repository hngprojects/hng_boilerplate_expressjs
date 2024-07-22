import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums/userRoles";
import { Unauthorized } from "./error";


export const checkPermissions = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      throw new Unauthorized("You do not have permission to perform this action");
    }
    next();
  };
};
