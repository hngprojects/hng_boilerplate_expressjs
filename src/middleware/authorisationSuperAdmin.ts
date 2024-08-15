import { Request, Response, NextFunction } from "express";
import { UserRole } from "../enums/userRoles"; // Adjust the import path as needed

export const authorizeRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role as UserRole; // Assuming `req.user.role` is set during authentication

    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient rights" });
    }
    next();
  };
};
