import { Request, Response, NextFunction } from "express";
import { UserType } from "../types";
import AppDataSource from "../data-source";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { OrgRole, UserOrganization } from "../models/user-organization";

export const checkPermissions = (roles: UserType[]) => {
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

      if (!user || !roles.includes(user.user_type)) {
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

export const checkOrgPermission = (roles: OrgRole[], userRoles: UserType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { org_id, id } = req.params;
    const orgId = org_id || id;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.decode(token);
      if (typeof decodedToken === "string" || !decodedToken) {
        return res
          .status(401)
          .json({ status: "error", message: "Access denied. Invalid token" });
      }

      const userId = decodedToken.userId;
      const userOrgRepository = AppDataSource.getRepository(UserOrganization);
      const userOrg = await userOrgRepository.findOne({
        where: { userId: userId, organizationId: orgId },
        relations: ["organizations"],
      });

      const user_type = userOrg.user.user_type;

      if (!userOrg) {
        return res.status(404).json({
          status: "error",
          message: "User is not a member of the orgnization",
        });
      }

      if (userRoles.includes(user_type)) {
        return next();
      }

      if (!roles.includes(userOrg.user_role)) {
        return res.status(401).json({
          status: "error",
          message: "Access denied. User is not an admin in the organization",
        });
      }
      next();
    } catch (error) {
      res.status(401).json({ status: "error", message: "Access denied." });
    }
  };
};
