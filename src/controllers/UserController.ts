import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.services";
import log from "../utils/logger";
import { HttpError } from "../middleware";
import { isUUID } from "class-validator";
import { validate } from "uuid";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      if (!id) {
        return res.status(401).json({
          status_code: 401,
          error: "Unauthorized",
        });
      }

      if (!validate(id)) {
        return res.status(401).json({
          status_code: 401,
          error: "Unauthorized! Invalid User Id Format",
        });
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({
          status_code: 404,
          error: "User Not Found!",
        });
      }

      if (user?.deletedAt || user?.is_deleted) {
        return res.status(404).json({
          status_code: 404,
          error: "User not found! (soft deleted user)",
        });
      }

      res.status(200).json({
        status_code: 200,
        message: "User profile details retrieved successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile_id: user.profile?.id,
          first_name: user.profile?.first_name,
          last_name: user.profile?.last_name,
          phone: user.profile?.phone,
          avatar_url: user.profile?.avatarUrl,
        },
      });
    } catch (error) {
      res.status(500).json({
        status_code: 500,
        error: "Internal Server Error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;

    if (!id || !isUUID(id)) {
      return res.status(400).json({
        status: "unsuccessful",
        status_code: 400,
        message: "Valid id must be provided",
      });
    }

    try {
      await this.userService.softDeleteUser(id);

      return res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        status_code: 200,
      });
    } catch (error) {
      log.error("Error deleting user", error.message);

      if (error instanceof HttpError) {
        return res.status(error.status_code).json({
          message: error.message,
        });
      } else if (error.message === "User not found") {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      } else {
        return res.status(500).json({
          message: error.message || "Internal Server Error",
        });
      }
    }
  }
}

export default UserController;