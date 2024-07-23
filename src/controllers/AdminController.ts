// src/controllers/UserController.ts
import { Request, Response } from "express";
import { AdminOrganisationService } from "../services";
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
      await param("user_id").isUUID().withMessage("Valid user ID must be provided.").run(req);
      await check("role").isIn(Object.values(UserRole)).withMessage("Valid role must be provided.").run(req);

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
      res.status(error.status_code || 500).json({ message: error.message || "Internal Server Error" });
    }
  }
}

export default { AdminOrganisationController };
