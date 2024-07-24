import { Request, Response } from "express";
import {
  AdminOrganisationService,
  AdminUserService,
  AdminLogService,
} from "../services";
import { HttpError } from "../middleware";
import { check, param, validationResult } from "express-validator";
import { UserRole } from "../enums/userRoles";

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
        data: {
          id: org.id,
          name: org.name,
          email: org.email,
          slug: org.slug,
          type: org.type,
          industry: org.industry,
          state: org.state,
          country: org.country,
          address: org.address,
          created_at: org.created_at,
          updated_at: org.updated_at,
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

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      if (page <= 0 || limit <= 0) {
        res.status(400).json({
          status: "bad request",
          message: "Invalid query params passed",
          status_code: 400,
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
