import { NextFunction, Request, Response } from "express";
import { OrganisationService } from "../services/createOrg.services";
import { OrgService } from "../services/OrgService";

export const createOrganisation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const user = req.user;
    const userId = user.id;

    const organisationService = new OrganisationService();
    const newOrganisation = await organisationService.createOrganisation(
      payload,
      userId
    );

    const thisOrgService = new OrgService();

    await thisOrgService.createInviteLink(
      newOrganisation.newOrganisation.id,
      "localhost:8000"
    );

    const respObj = {
      status: "success",
      message: "organisation created successfully",
      data: newOrganisation,
      status_code: 201,
    };

    return res.status(201).json(respObj);
  } catch (error) {
    return next(error);
  }
};
