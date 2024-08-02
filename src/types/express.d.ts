import { UserType } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: UserType;
      };
    }
  }
}
