import { Organization, User } from "../models";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
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

export interface IAuthService {
  login(payload: IUserLogin): Promise<unknown>;
  signUp(payload: IUserSignUp, res: unknown): Promise<unknown>;
  verifyEmail(token: string, otp: number): Promise<{ message: string }>;
}


//Orgnaization interfaces begins

export interface IOrganizationCreation {
  name: string
  description: string
}

export interface IOrganizationService {
  deleteOrganization(id: string): Promise<Object>;
  createOrganization(is: string, payload: IOrganizationCreation): Promise<Object>;
  getOrganization(is: string, payload: IOrganizationCreation): Promise<Object>;
}
