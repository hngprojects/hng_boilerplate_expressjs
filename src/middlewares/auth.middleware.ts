// import { Request, Response, NextFunction } from "express";
// import { AppDataSource } from "../config/ormconfig";
// import { Organization } from "../entities/Organization.entites";

// export interface AuthenticatedRequest extends Request {
//   organization?: Organization;
// }

// export const authenticate = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const organizationId = req.headers["organization-id"] as string;

//   if (!organizationId) {
//     return res.status(403).json({ error: "No organization ID provided" });
//   }

//   const organizationRepository = AppDataSource.getRepository(Organization);
//   const organization = await organizationRepository.findOne({
//     where: { id: organizationId },
//   });

//   if (!organization) {
//     return res.status(403).json({ error: "Invalid organization ID" });
//   }

//   req.organization = organization;
//   next();
// };
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../types/User";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user: User) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Authorization middleware to check if user has the required role
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.sendStatus(403);
    }
    next();
  };
};
