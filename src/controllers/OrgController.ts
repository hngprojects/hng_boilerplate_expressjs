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
        req.params.user_id
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

  async acceptInvite(req: Request, res: Response) {
    try {
      const current_user = req.user;
      const organisation = await this.orgService.acceptLinkInvite(
        req.params.org_id,
        current_user
      );

      if (!organisation) {
        return res.status(404).json({
          status: "forbidden",
          message: "There is no organization with this ID",
          status_code: 404,
        });
      }
    } catch (error) {
      res.status(400).json({ message: "Error joining organization" });
    }
  }
}
