// types/User.ts
export interface User {
  id: string;
  email: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
