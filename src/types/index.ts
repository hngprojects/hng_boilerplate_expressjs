import { User } from "../models";
import { JobMode, JobType, SalaryRange } from "../models/job";
import { NotificationSettings, Notifications } from "../models";

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
  googleSignin(payload: GoogleVerificationPayloadInterface): Promise<{
    userInfo: Partial<User>;
    is_new_user: boolean;
  }>;
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

export interface INotificationSettings {
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

export interface INotificationSettingService {
  updateNotificationSetting(
    payload: INotificationSettings,
    userId: string,
    auth_userId: string,
  ): Promise<NotificationSettings>;
}

export interface INotification {
  message: string;
  is_read: boolean;
}
export interface INotificationService {
  getUserNotification(user_id: string, auth_userId: string): Promise<any>;
  createNotification(
    payload: INotification,
    userId: string,
  ): Promise<Notifications>;
  isReadUserNotification(
    notificationId: string,
    userId: string,
    payload: {
      is_read: boolean;
    },
  ): Promise<any>;
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

export interface GoogleVerificationPayloadInterface {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export type UserResponsePayload = Pick<
  User,
  "id" | "first_name" | "last_name" | "email"
> & {
  role: string;
  avatar_url: string;
  user_name: string;
};

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface SmsData {
  message: string;
  phone_number: string;
}

export interface IJobs {
  title: string;
  description: string;
  location: string;
  deadline: Date;
  salary_range: SalaryRange;
  job_type: JobType;
  job_mode: JobMode;
  company_name: string;
  is_deleted?: boolean;
}

export interface ICreateJobs extends Omit<IJobs, "id" | "is_deleted"> {
  user_id: string;
}

export interface IUpdateJobs {
  title?: string;
  description?: string;
  location?: string;
  deadline?: Date;
  salary_range?: SalaryRange;
  job_type?: JobType;
  job_mode?: JobMode;
  company_name?: string;
}

export interface IDeleteJobs {
  id: string;
}

export interface IUserProfileUpdate {
  first_name: string;
  last_name: string;
  phone: string;
  username: string;
  jobTitle: string;
  pronouns: string;
  department: string;
  bio: string;
  social_links: string[];
  language: string;
  region: string;
  timezones: string;
  profile_pic_url: string;
}
