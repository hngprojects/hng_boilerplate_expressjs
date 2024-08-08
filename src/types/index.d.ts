import { User } from "../models";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}

export interface IOrgService {}

export interface IRole {
  role: "super_admin" | "admin" | "user";
}

export interface IUserSignUp {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
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
  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }>;
  generateMagicLink(email: string): Promise<{ ok: boolean; message: string }>;
  validateMagicLinkToken(
    token: string,
  ): Promise<{ status: string; email: string; userId: string }>;
  passwordlessLogin(userId: string): Promise<{ access_token: string }>;
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
  removeUser(org_id: string, user_id: string): Promise<User | null>;
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

export interface GoogleUser {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
}

export interface INewsLetterSubscriptionService {
  subscribeUser(email: string): Promise<any>;
  unSubcribeUser(email: string): Promise<any>;
}

export interface INewsLetterSubscription {
  email: string;
}
