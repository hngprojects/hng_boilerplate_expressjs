// / src/services/AdminOrganisationService.ts
import { NextFunction, Request, Response } from "express";
// import { getRepository, Repository } from 'typeorm';
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
      await orgRepository.update(org_id, {
        name,
        email,
        industry,
        type,
        country,
        address,
        state,
      });
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
}

export class AdminUserService {
  async getPaginatedUsers(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; totalUsers: number }> {
    const userRepository = AppDataSource.getRepository(User);

    const [users, totalUsers] = await userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { users, totalUsers };
  }
}
