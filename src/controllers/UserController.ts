// src/controllers/UserController.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john.doe@example.com
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         role:
 *           type: string
 *           description: The user role
 *         profile:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The profile ID
 *             first_name:
 *               type: string
 *               description: The user's first name
 *             last_name:
 *               type: string
 *               description: The user's last name
 *             phone:
 *               type: string
 *               description: The user's phone number
 *             avatar_url:
 *               type: string
 *               description: The URL of the user's avatar
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john.doe@example.com
 *         role: admin
 *         profile:
 *           id: prof_12345
 *           first_name: John
 *           last_name: Doe
 *           phone: 1234567890
 *           avatar_url: https://example.com/avatar.jpg
 */

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';
import { HttpError } from '../middleware';
import { isUUID } from 'class-validator';
import { validate } from 'uuid';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      // const id = "96cf0567-9ca6-4ce0-b9f7-e3fa816fc070";
      if (!id) {
        return res.status(401).json({
          status_code: 401,

          error: 'Unauthorized',
          error: "Unauthorized! no ID provided",

        });
      }

      if (!validate(id)) {

        return res.status(401).json({
          status_code: 401,
          error: 'Unauthorized! Invalid User Id Format',
        return res.status(400).json({
          status_code: 400,
          error: "Unauthorized! Invalid User Id Format",
        });
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({
          status_code: 404,
          error: 'User Not Found!',
        });
      }

      if (user?.deletedAt || user?.is_deleted) {
        return res.status(404).json({
          status_code: 404,
          error: 'User not found! (soft deleted user)',
        });
      }

      res.status(200).json({
        status_code: 200,
        message: 'User profile details retrieved successfully',
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
        error: 'Internal Server Error',
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
        status: 'unsuccesful',
        status_code: 400,
        message: 'Valid id must be provided',
        status: "unsuccesful",
        status_code: 400,
        message: "Valid id must be provided",
      });
    }

    try {
      await this.userService.softDeleteUser(id);

      return res.status(202).json({
<
        status: 'sucess',
        message: 'User deleted successfull
        status: "sucess",
        message: "User deleted successfully",
        status_code: 202,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status_code).json({
          message: error.message,
        });
      } else {
        return res.status(500).json({
          message: error.message || 'Internal Server Error',
        });
      }
    }
  }
}

export default UserController;
          message: error.message || "Internal Server Error",
        });
      }
    }
  }

  public async updateUserProfile(req: Request, res: Response) {
    try {
      const user = await this.userService.updateUserProfile(
        req.params.id,
        req.body,
        req.file,
      );
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status_code).json({
          message: error.message,
        });
      } else {
        return res.status(500).json({
          message: error.message || "Internal Server Error",
        });
      }
    }
  }
}

export { UserController };
