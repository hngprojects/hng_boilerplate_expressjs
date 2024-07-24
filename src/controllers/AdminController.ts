import { Request, Response } from "express";
import {
  AdminOrganisationService,
  AdminUserService,
  AdminLogService,
} from "../services";
import { HttpError } from "../middleware";
import { check, param, validationResult } from "express-validator";
import { UserRole } from "../enums/userRoles";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Related Routes
 */

/**
 * @swagger
 * /api/v1/admin/organisation/:id:
 *   patch:
 *     summary: Admin-Update an existing organisation
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               slug:
 *                 type: string
 *               type:
 *                 type: string
 *               industry:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organisation Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     type:
 *                       type: string
 *                     industry:
 *                       type: string
 *                     state:
 *                       type: string
 *                     country:
 *                       type: string
 *                     address:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                 status_code:
 *                   type: integer
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

class AdminOrganisationController {
  private adminService: AdminOrganisationService;

  constructor() {
    this.adminService = new AdminOrganisationService();
  }

  async updateOrg(req: Request, res: Response): Promise<void> {
    try {
      const org = await this.adminService.update(req);
      res.status(200).json({
        success: true,
        message: "Organisation Updated Successfully",
        status_code: 200,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({
          success: false,
          message: error.message,
          status_code: error.status_code,
        });
      } else {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async setUserRole(req: Request, res: Response): Promise<void> {
    try {
      await param("user_id")
        .isUUID()
        .withMessage("Valid user ID must be provided.")
        .run(req);
      await check("role")
        .isIn(Object.values(UserRole))
        .withMessage("Valid role must be provided.")
        .run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({
          status: "unsuccessful",
          status_code: 422,
          message: errors.array()[0].msg,
        });
        return;
      }
      const user = await this.adminService.setUserRole(req);
      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: {
          id: user.id,
          username: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      res
        .status(error.status_code || 500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}

class AdminUserController {
  private adminUserService: AdminUserService;

  constructor() {
    this.adminUserService = new AdminUserService();
  }

  /**
   * @swagger
   * /api/v1/admin/users/:id:
   *   patch:
   *     summary: Admin-Update an existing user
   *     tags: [Admin]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The ID of the user to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               role:
   *                 type: string
   *               isverified:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: User Updated Successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *                     isverified:
   *                       type: boolean
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                 status_code:
   *                   type: integer
   *       400:
   *         description: Bad Request
   *       404:
   *         description: User Not Found
   *       500:
   *         description: Internal Server Error
   */

  //Update Single User
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.adminUserService.updateUser(req);
      res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isverified: user.isverified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        status_code: 200,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/admin/users:
   *   get:
   *     summary: Admin-List users with pagination
   *     tags: [Admin]
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         description: Page number for pagination
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         description: Number of users per page
   *         schema:
   *           type: integer
   *           default: 5
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                       email:
   *                         type: string
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     totalUsers:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *                     currentPage:
   *                       type: integer
   *                 status_code:
   *                   type: integer
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      if (page <= 0 || limit <= 0) {
        res.status(400).json({
          status: "unsuccessful",
          status_code: 400,
          message:
            "Invalid pagination parameters. Page and limit must be positive integers.",
        });
        return;
      }

      const { users, totalUsers } =
        await this.adminUserService.getPaginatedUsers(page, limit);
      const pages = Math.ceil(totalUsers / limit);

      if (page > pages) {
        res.status(400).json({
          status: "bad request",
          message: `last page reached page: ${pages}`,
          status_code: 400,
        });
        return;
      }

      res.json({
        success: true,
        message: "Users retrieved successfully",
        users: users.map((user) => ({
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        })),
        pagination: {
          totalUsers,
          totalPages: pages,
          currentPage: page,
        },
        status_code: 200,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }
}

// Get activities log
class AdminLogController {
  private adminLogService: AdminLogService;

  constructor() {
    this.adminLogService = new AdminLogService();
  }

  async getLogs(req: Request, res: Response): Promise<void> {
    try {
      await check("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer.")
        .run(req);
      await check("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer.")
        .run(req);
      await check("sort")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage('Sort must be either "asc" or "desc".')
        .run(req);
      await check("offset")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Offset must be a non-negative integer.")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          status: "unsuccessful",
          status_code: 422,
          message: errors.array()[0].msg,
        });
        return;
      }

      const data = await this.adminLogService.getPaginatedLogs(req);
      res.status(200).json({
        status: "success",
        status_code: 200,
        data,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }
}

export default {
  AdminOrganisationController,
  AdminUserController,
  AdminLogController,
};
