// / src/services/AdminOrganisationService.ts
import { NextFunction, Request, Response } from "express";
import { User, Organization } from "../models";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";

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

  public async setUserRole(req: Request): Promise<User> {
    try {
      const { role } = req.body;
      const { user_id } = req.params;

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { id: user_id },
      });
      
      if (!user) {
        throw new HttpError(404, "User not Found");
      }
   
      // Update User Role on the Database
      user.role = role;
      await userRepository.save(user);

      return user;
    } catch (error) {
      throw new HttpError(error.status_code || 500, error.message);
    }
  }
}

