// / src/services/AdminOrganisationService.ts
import { NextFunction, Request, Response } from "express";
import { User, Organization } from "../models";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import { validate as uuidValidate } from "uuid";

export class AdminOrganisationService {

  public async update(req: Request): Promise<Organization> {
    try {
      const { name, email, industry, type, country, address, state } = req.body;
      const org_id = req.params.id;

      const orgRepository = AppDataSource.getRepository(Organization);
      // Check if organisation exists
      const oldOrg = await orgRepository.findOne({
        where: { id: org_id },
      });
      if (!oldOrg) {
        throw new HttpError(404, "Not Found");
      }
      
      //Update Organisation on DB
      await orgRepository.update(org_id, {  name, email, industry, type, country, address, state });
      //Fetch Updated organisation
      const newOrg = await orgRepository.findOne({
        where: { id: org_id },
      });
      return newOrg;
    } catch (error) {
      console.error(error);
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async getSingleOrgById(req: Request): Promise<Organization> {
    try {
      const org_id = req.params.id;
      if (!uuidValidate(org_id)) {
        throw new HttpError(400, "Invalid organization ID.");
      }

      const orgRepository = AppDataSource.getRepository(Organization);
      const org = await orgRepository.findOne({
        where: { id: org_id },
      });
      if (!org) {
        throw new HttpError(404, "Organization Not Found");
      }
      return org;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, "Failed to retrieve organization. Please try again later.");
      }
    }
  }
}

