// src/controllers/UserController.ts
import log from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import { validate } from "uuid";

class UserController {
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

      if (user?.deletedAt || user?.isDeleted) {
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

  async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.deleteUserById(req.params.id);
      return res.status(200).json({
        status: 200,
        message: "User deleted successfully"
      });
    } catch (error) {
      log.error("Error deleting user", error.message);

      if (error.message === "User not found") {
        return res.status(404).json({
          status: 404,
          message: "User not found"
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error"
      });
    }
  }
}

export { UserController };
