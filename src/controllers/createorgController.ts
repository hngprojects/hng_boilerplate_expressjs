import { NextFunction, Request, Response } from "express";
import { HttpError } from "../middleware";
import * as jwt from "jsonwebtoken"
import config from "../config";
import { OrganisationService } from "../services/createOrg.services";

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