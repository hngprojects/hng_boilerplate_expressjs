import { User } from "../models";
import { Request } from "express";
import { UserRole } from "../enums/userRoles";

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

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
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
    userId: string,
  ): Promise<unknown>;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export interface EmailQueuePayload {
  templateId: string;
  recipient: string;
  variables?: Record<string, any>;
}
