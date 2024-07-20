import { User } from "../models";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}

export interface IOrgService {
  removeUser(org_id: string, user_id: string): Promise<User | null>;
}

export interface IRole {
  role: "super_admin" | "admin" | "user";
}

interface IUserSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface IAuthService {
  // login(email: string, password: string): Promise<User>;
  signUp(payload: IUserSignUp, res: unknown): Promise<unknown>;
  verifyEmail(token: string, otp: number): Promise<{ message: string }>;
}
