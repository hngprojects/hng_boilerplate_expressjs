import { User } from "../models";
import { Request } from "express";
import { UserRole } from "../enums/userRoles";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}

export interface IOrgService {}

export interface IRole {
  role: "super_admin" | "admin" | "user";
}

export interface IUserSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthService {
  login(payload: IUserLogin): Promise<unknown>;
  signUp(payload: IUserSignUp, res: unknown): Promise<unknown>;
  verifyEmail(token: string, otp: number): Promise<{ message: string }>;
}

export interface ICreateOrganisation {
  name: string;
  description: string;
  email: string;
  industry: string;
  type: string;
  country: string;
  address: string;
  state: string;
}

export interface IOrganisationService {
  createOrganisation(
    payload: ICreateOrganisation,
    userId: string
  ): Promise<unknown>;
<<<<<<< HEAD
  removeUser(org_id: string, user_id: string): Promise<User | null>;
=======
>>>>>>> 87103b0e46f4b215c92c79ee993fb65642ff8c1a
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
