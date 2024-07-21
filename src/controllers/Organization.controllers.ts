import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/orgnaization.services";


const organizationService = new OrganizationService();

const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    
  } catch (error) {
    next(error);
  }
};

export { deleteOrganization };
