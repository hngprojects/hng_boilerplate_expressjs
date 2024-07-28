// src/controllers/UserController.ts
import { isUUID } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";
import { HttpError } from "../middleware";
import { UserService } from "../services";

class UserController {
  private userService: UserService;

  /**
   * @swagger
   * tags:
   *  name: User
   *  description: User related routes
   */
  constructor() {
    this.userService = new UserService();
  }

  /**
   * @swagger
   * /api/v1/users/me:
   *  get:
   *    tags:
   *      - User
   *    summary: Get User profile
   *    security:
   *      - bearerAuth: []
   *    description: Api endpoint to retrieve the profile data of the currently authenticated user. This will allow users to access their own profile information.
   *    responses:
   *      200:
   *        description: Fetched User profile Successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status_code:
   *                  type: integer
   *                  example: 200
   *                data:
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: string
   *                      example: 58b6
   *                    user_name:
   *                      type: string
   *                      example: yasuke
   *                    email:
   *                      type: string
   *                      example: sam@gmail.com
   *                    profile_picture:
   *                      type: string
   *                      example: https://avatar.com
   *
   *      401:
   *        description: Unauthorized access
   *      404:
   *        description: Not found
   *      500:
   *        description: Internal Server Error
   *
   */

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      // const id = "953a46af-c635-4edf-a7d9-17393ab93be2";
      if (!id) {
        return res.status(401).json({
          status_code: 401,
          error: "Unauthorized! no ID provided",
        });
      }

      if (!validate(id)) {
        return res.status(400).json({
          status_code: 400,
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
          error: "User not found!",
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

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     tags:
   *       - User
   *     summary: Get all users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Get all users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Users retrieved successfully
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     totalItems:
   *                       type: integer
   *                       example: 100
   *                     totalPages:
   *                       type: integer
   *                       example: 10
   *                     currentPage:
   *                       type: integer
   *                       example: 1
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       user_name:
   *                         type: string
   *                         example: Lewis
   *                       email:
   *                         type: string
   *                         example: lewis@gmail.com
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server Error
   */

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /api/v1/user/{id}:
   *   delete:
   *     tags:
   *       - User
   *     summary: Soft Delete a user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: uuid
   *         description: The ID of the user
   *     responses:
   *       202:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 202
   *                 message:
   *                   type: string
   *                   example: User deleted successfully
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Valid id must be provided
   *       404:
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: User not found
   *       500:
   *         description: Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Failed to perform soft delete
   */
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;

    if (!id || !isUUID(id)) {
      return res.status(400).json({
        status: "unsuccesful",
        status_code: 400,
        message: "Valid id must be provided",
      });
    }

    try {
      await this.userService.softDeleteUser(id);

      return res.status(202).json({
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
          message: error.message || "Internal Server Error",
        });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   patch:
   *     tags:
   *       - User
   *     summary: SuperAdmin- Update a user
   *     description: API endpoint that allows authenticated super admins to update a single user's details. This endpoint ensures that only users with super admin privileges can modify user information, maintaining system security.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: New
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               role:
   *                 type: string
   *               password:
   *                 type: string
   *               isVerified:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Successfully updated the user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 status_code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *                     created_at:
   *                       type: string
   *                       format: date-time
   *                     updated_at:
   *                       type: string
   *                       format: date-time
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Error
   *                 status_code:
   *                   type: integer
   *                   example: 422
   *                 message:
   *                   type: string
   *                   example: "Invalid user details provided."
   *       403:
   *         description: Access denied
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: Error
   *                 status_code:
   *                   type: integer
   *                   example: 403
   *                 message:
   *                   type: string
   *                   example: "Access denied. Super admin privileges required."
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: unsuccessful
   *                 status_code:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "User with id '123' not found"
   *       500:
   *         description: Server Error
   */

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
