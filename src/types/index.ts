import { User } from "../models";
import { NotificationSettings } from "../models";

export enum UserType {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  USER = "vendor",
}

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
  admin_secret?: string;
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
  // login(payload: IUserLogin): Promise<unknown>;
  signUp(payload: IUserSignUp, res: unknown): Promise<unknown>;
  verifyEmail(token: string, email: string): Promise<unknown>;
  // changePassword(
  //   userId: string,
  //   oldPassword: string,
  //   newPassword: string,
  //   confirmPassword: string,
  // ): Promise<{ message: string }>;
  // generateMagicLink(email: string): Promise<{ ok: boolean; message: string }>;
  // validateMagicLinkToken(
  //   token: string,
  // ): Promise<{ status: string; email: string; userId: string }>;
  // passwordlessLogin(userId: string): Promise<{ access_token: string }>;
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

export interface INotificationSettingsPayload {
  user_id?: string;
  mobile_notifications?: boolean;
  email_notifications_activity_workspace?: boolean;
  email_notifications_always_send_email?: boolean;
  email_notifications_email_digests?: boolean;
  email_notifications_announcement__and_update_emails?: boolean;
  slack_notifications_activity_workspace?: boolean;
  slack_notifications_always_send_email?: boolean;
  slack_notifications_email_digests?: boolean;
  slack_notifications_announcement__and_update_emails?: boolean;
}

// export interface createNotification {
//   notificationSetting(
//     mobile_notifications: boolean,
//     email_notifications_activity_workspace: boolean,
//     email_notifications_always_send_email: boolean,
//     email_notifications_email_digests: boolean,
//     email_notifications_announcement__and_update_emails: boolean,

//   )
// }

export interface INotificationSettingService {
  createNotification(
    payload: INotificationSettingsPayload,
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

export interface GoogleUser {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
}
