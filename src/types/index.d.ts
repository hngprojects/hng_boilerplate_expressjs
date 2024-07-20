import { User } from "../models";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}

export interface IOrgService {
  removeUser(org_id: string, user_id: string): Promise<User | null>;
}
