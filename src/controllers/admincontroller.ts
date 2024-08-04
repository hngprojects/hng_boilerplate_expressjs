// admin conroller
import { Request, Response } from "express";
import { AdminOrganisationService } from "../services";
import { sendJsonResponse } from "../helpers";
class AdminOrganisationController {
  private adminService: AdminOrganisationService;

  constructor() {
    this.adminService = new AdminOrganisationService();
  }

  async updateOrg(req: Request, res: Response): Promise<void> {
    const org = await this.adminService.update(req.params.id, req.body);
    if (org) {
      sendJsonResponse(res, 200, "Organization updated successfully", org);
    } else {
      res.status(400).json({
        message: "failed to update organisation",
      });
    }
  }

  async deleteOrganization(req: Request, res: Response) {
    const { org_id } = req.params;

    if (!org_id) {
      return res.status(400).json({
        status: "unsuccessful",
        status_code: 400,
        message: "Valid organization ID must be provided.",
      });
    }
    const result = await this.adminService.deleteOrganization(org_id);
    sendJsonResponse(res, 200, "Organization deleted successfully", result);

    if (!result) {
      res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Failed to delete organization.",
      });
    }
  }
}

class AdminUserController {}

class AdminLogController {}

export default {
  AdminOrganisationController,
  AdminUserController,
  AdminLogController,
};
