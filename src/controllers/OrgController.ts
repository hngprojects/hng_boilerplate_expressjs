 import { Request, Response } from "express";
import { OrgService } from "../services/OrgService";

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
        message: "User deleted succesfully",
        status_code: 200,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to remove user from organization" });
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

    try {
      await this.orgService.deleteOrganization(org_id);
      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "Organization deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        status: "unsuccessful",
        status_code: 500,
        message: "Failed to delete organization. Please try again later.",
      });
    }
  }
}
