 import { Request, Response } from "express";
import { OrgService } from "../services/org.services";
import log from "../utils/logger";

export class OrgController {
  private orgService: OrgService;
  constructor() {
    this.orgService = new OrgService();
  }

  async removeUser(req: Request, res: Response) {
    try {
      const user = await this.orgService.removeUser(
        req.params.org_id,
        req.params.user_id,
      );
      if (!user) {
        return res.status(404).json({
          status: "forbidden",
          message: "User not found in the organization",
          status_code: 404,
        });
      }
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        status_code: 200,
      });
    } catch (error) {
      log.error("Failed to remove user from organization:", error);
      res.status(400).json({ message: "Failed to remove user from organization" });
    }
  }


 
  async getOrganizations(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      log.info("req.user:", req.user);
      if (!req.user || req.user.id !== userId) {
        return res.status(400).json({
          status: "unsuccessful",
          status_code: 400,
          message: "Invalid user ID or authentication mismatch.",
        });
      }
      const organizations = await this.orgService.getOrganizationsByUserId(userId);

      if (organizations.length === 0) {
        return res.status(200).json({
          status: "success",
          status_code: 200,
          message: "No organizations found for this user.",
          data: [],
        });
      }

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Organizations retrieved successfully.",
        data: organizations,
      });
    } catch (error) {
      log.error("Failed to retrieve organizations:", error);
      res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Failed to retrieve organizations. Please try again later.",
      });
    }
  }

 
  async getSingleOrg(req: Request, res: Response) {
    try {
      const org = await this.orgService.getSingleOrg(req.params.org_id);
      if (!org) {
        return res.status(404).json({
          status: "forbidden",
          message: "Organization not found",
          status_code: 404,
        });
      }
      res.status(200).json({
        status: "success",
        status_code: 200,
        data: {
          org_id: org.id,
          name: org.name,
          description: org.description,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Failed to get user organisation. Please try again later.",
      });
    }
  }

  
  
}
