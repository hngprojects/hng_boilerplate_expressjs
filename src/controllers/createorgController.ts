import { NextFunction, Request, Response } from "express";
import { OrganisationService } from "../services/createOrg.services";

export const createOrganisation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const user = req.user;
    const userId = user.id;

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