import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/orgnaization.services";
import jwt from "jsonwebtoken";
import config from "../config";
import { UserService } from "../services";
import { User } from "../models";
import { BadRequest, ResourceNotFound, Unauthorized } from "../middleware";
import validator from 'validator';


const organizationsService = new OrganizationService();
const userService = new UserService();

const verifytoken = (token: string): any => {
    try {
        const decoded: any = jwt.verify(token, config.TOKEN_SECRET);
        const userId = decoded.userId;
        return userId;
    } catch(err) {
        return false;
    }
}

const verifyUser = async (userId: string): Promise<User | null> => {
    try {
        const user = await userService.getUserById(userId)
        return user
    } catch(err) {
        return null
    }
}

const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwToken : string = req.headers?.authorization?.split(" ")[1];
        if (!jwToken) {
            throw new Unauthorized("No auth token")
        }
        const userId = verifytoken(jwToken);
        if (!userId) {
            throw new Unauthorized("Invalid Token")
        }
        const user = verifyUser(userId)
        if (!user) {
            throw new Unauthorized("Invalid User")
        }
        const newOrganization = await organizationsService.createOrganization(userId, req.body)
        res.status(201).json({
            message: "Organization Created",
            status_code: "201",
            data: newOrganization
        })
    } catch(error) {
        next(error)
    }
}

const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orgId } = req.params;
        if (!validator.isUUID(orgId)) {
            throw new BadRequest("Invalid organization ID format");
        }
        const jwToken : string = req.headers.authorization?.split(" ")[1];
        if (!jwToken) {
            throw new Unauthorized("No auth token")
        }
        const userId = await verifytoken(jwToken);
        if (!userId) {
            throw new Unauthorized("Invalid Token")
        }
        const organizationExist = await organizationsService.getOrganization(orgId)
        if (!organizationExist) {
            throw new ResourceNotFound("Invalid organization ID");
        }
        const user = await verifyUser(userId)
        if (!user) {
            throw new Unauthorized("Invalid User")
        }
        const isUserOrganization = user.organizations.find(org => org.id === orgId);
        if (!isUserOrganization && (user.role !== 'admin')) {
            throw new Unauthorized("User not authorized to delete this organization")
        }
        await organizationsService.deleteOrganization(orgId)
        res.status(200).json({
            message: "Organization deleted successfully",
            status_code: 204
        })
    } catch (error) {
        next(error);
    }
};

export {
    deleteOrganization,
    createOrganization
};
