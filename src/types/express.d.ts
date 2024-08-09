import { UserRole } from "../enums/userRoles";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: UserRole;
      };
    }
  }
}
