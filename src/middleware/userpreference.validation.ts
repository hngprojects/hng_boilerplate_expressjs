import { IUserUpdatePayload } from "../types";

export const validateUserProfileUpdate = (updates: IUserUpdatePayload): string[] => {
  const errors: string[] = [];

  if (updates.name && updates.name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (updates.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updates.email)) {
    errors.push("Invalid email format");
  }

  // Add more validation rules as needed

  return errors;
};