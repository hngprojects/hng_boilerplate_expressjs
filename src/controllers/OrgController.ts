import { Request, Response, NextFunction } from "express";
import { OrgService } from "../services/organization.services";

export class OrgController {
  private orgService: OrgService;
  constructor() {
    this.orgService = new OrgService();
  }

  async createOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const user = req.user;
      const userId = user.id;

      const organisationService = new OrgService();
      const newOrganisation = await organisationService.createOrganisation(
        payload,
        userId
      );

      const respObj = {
        status: "success",
        message: "organisation created successfully",
        data: newOrganisation,
        status_code: 201,
      };

      return res.status(201).json(respObj);
    } catch (error) {
      next(error);
    }
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
}
