// / src/services/AdminOrganisationService.ts
import { NextFunction, Request, Response } from "express";
// import { getRepository, Repository } from 'typeorm';
import { User, Organization } from "../models";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import { hashPassword } from "../utils/index";

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
  public async updateUser(req: Request): Promise<User> {
    try {
      const { firstName, lastName, email, role, password, isverified } =
        req.body;

      const userRepository = AppDataSource.getRepository(User);

      const existingUser = await userRepository.findOne({
        where: { email },
      });
      if (!existingUser) {
        throw new HttpError(404, "User not found");
      }

      let hashedPassword: string | undefined;
      if (password) {
        hashedPassword = await hashPassword(password);
      }

      const updatedFields = {
        name: `${firstName} ${lastName}`,
        email,
        role,
        password: hashedPassword || existingUser.password,
        isverified:
          isverified !== undefined ? isverified : existingUser.isverified,
      };

      await userRepository.update(existingUser.id, updatedFields);

      const updatedUser = await userRepository.findOne({
        where: { id: existingUser.id },
      });
      return updatedUser!;
    } catch (error) {
  
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
