import { Request, Response } from "express";
import { OrgService } from "../services/organisation.services";

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
  async createInvitation(req: Request, res: Response) {
    try {
      const { org_id } = req.params;
      const { email, expiresIn } = req.body;

      if (!email || expiresIn) {
        return res.status(400).json({
          status: "unsuccessful",
          message: "Valid email or expire time must be provided",
          status_code: 400,
        });
      }

      if (!org_id) {
        return res.status(404).json({
          status: "unsuccessful",
          message: "Organization not found",
          status_code: 404,
        });
      }

      const invitation = await this.orgService.createInvitation(
        org_id,
        email,
        expiresIn
      );

      return res.status(201).json({
        status: "success",
        message: "Invitation sent successfully",
        data: { invitation },
        status_code: 201,
      });
    } catch (error) {
      return res.status(500).json({
        status: "success",
        message: "Failed to send invitation.",
        status_code: 500,
      });
    }
  }
}
