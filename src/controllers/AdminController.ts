// src/controllers/UserController.ts
import { Request, Response } from "express";
import { AdminOrganisationService,AdminUserService } from "../services";
import { HttpError } from "../middleware";

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
}

class AdminUserController {
  private adminUserService: AdminUserService;

  constructor() {
    this.adminUserService = new AdminUserService();
  }

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
        res.status(500).json({ message: error.message || "Internal Server Error" });
      }
    }
  }
}

export default { AdminOrganisationController, AdminUserController };
