import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import { sendJsonResponse } from "../helpers";

const userService = new UserService();

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUserProfile(req.params.id, req.body, req.file);
    sendJsonResponse(res, 200, "Profile successfully updated", user);
  } catch (error) {
    next(error);
  }
};
