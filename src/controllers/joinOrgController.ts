import { Request, Response, NextFunction } from "express";
import { OrgService } from "../services/org.services";

export class JoinOrgController {
  private orgService = new OrgService();

  public async joinOrganization(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { inviteToken } = req.body;
      const userId = req.user.id;
      await this.orgService.joinOrganizationByInvite(inviteToken, userId);

      res.status(200).json({
        status: "success",
        status_code: 200,
        message: "User successfully added to the organization.",
      });
    } catch (error) {
      res.status(400).json({
        status: "unsuccessful",
        status_code: 400,
        message: error.message,
      });
    }
  }
}
