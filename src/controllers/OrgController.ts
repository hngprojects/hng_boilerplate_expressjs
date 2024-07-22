import { NextFunction, Request, Response } from "express";
import { BadRequest, HttpError, ResourceNotFound, ServerError, Unauthorized } from "../middleware";
import * as jwt from "jsonwebtoken"
import config from "../config";
import { OrganisationService } from "../services";
import { OrgService } from "../services/OrgService";
import validator from "validator";


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
  }

export const createOrganisation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        throw new HttpError(401, "Unauthorized");
      }
      const decoded: any = jwt.verify(token, config.TOKEN_SECRET);
      const userId = decoded.userId;
      const payload = req.body;
  
      const organisationService = new OrganisationService();
      const newOrganisation = await organisationService.createOrganisation(payload, userId);
  
      const respObj = {
        status: "success",
        message: "organisation created successfully",
        data: newOrganisation,
        status_code: 201
      }
  
      return res.status(201).json(respObj);
    } catch (error) {
      return next(error);
    }
}

export const deleteOrganisation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organisationService = new OrganisationService();
        const {orgId} = req.params;
        // const{ userId} = req.user;
        const userId = null
        
        if (!validator.isUUID(orgId)) {
            throw new BadRequest("Invalid organization ID format");
        }
        const organisationExist = await organisationService.getOrganisation(orgId)
        if (!organisationExist) {
            throw new ResourceNotFound("Invalid organisation ID - Not found");
        }
        const isUserOrganization = organisationExist.userOrganizations.find(user => user.userId === userId);
        if(!isUserOrganization || isUserOrganization.role !== "admin") {
            throw new Unauthorized("User not authorized to delete this organization")
        }
        const deletedOrg = await organisationService.deleteOrganisation(orgId)
        if (!deletedOrg) {
            throw new ServerError("Server error")
        }
        res.status(200).json({
            message: "Organization deleted successfully",
            status_code: 204
        })
    } catch(error) {
        next(error);
    }
}
