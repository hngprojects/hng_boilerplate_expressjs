import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/orgnaization.services";
import log from "../utils/logger";
import jwt from "jsonwebtoken";
import config from "../config";
import { UserService } from "../services";
import { User } from "../models";


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
            return res.status(401).json({
                message: "Authentication Failed!",
                error: "No authorization token",
                status_code: 401
            })
        }
        const userId = verifytoken(jwToken);
        if (!userId) {
            return res.status(401).json({
                message: "Authentication Failed!",
                error: "Invalid token",
                status_code: 401
            })
        }
        const user = verifyUser(userId)
        if (!user) {
            return res.status(400).json({
                message: "Bad Request",
                error: "Invalid User",
                status_code: 400
            })
        }
        const newOrganization = await organizationsService.createOrganization(userId, req.body)
        res.status(201).json({
            message: "Organization Created",
            status_code: "201",
            data: newOrganization
        })
    } catch(err) {
        log.error(err)
    }
}

const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orgId } = req.params;
        const jwToken : string = req.headers.authorization?.split(" ")[1];
        if (!jwToken) {
            return res.status(401).json({
                message: "Authentication Failed!",
                error: "No authorization token",
                status_code: 401
            })
        }
        const userId = await verifytoken(jwToken);
        if (!userId) {
            return res.status(401).json({
                message: "Authentication Failed!",
                error: "Invalid token",
                status_code: 401
            })
        }
        const organizationExist = await organizationsService.getOrganization(orgId)
        if (!organizationExist) {
            return res.status(404).json({
                message: "Bad request",
                error: "Organization not found",
                status_code: 404
            })
        }
        const user = await verifyUser(userId)
        if (!user) {
            return res.status(400).json({
                message: "Bad Request",
                error: "Invalid User",
                status_code: 400
            })
        }
        const isUserOrganization = user.organizations.find(org => org.id === orgId);
        if (!isUserOrganization && user.role !== 'admin') {
            return res.status(401).json({
                message: "Bad Request",
                error: "You cannot delete this organization",
                status_code: 401
            })
        }
        await organizationsService.deleteOrganization(orgId)
        res.status(200).json({
            message: "Organization deleted successfully"
        })
    } catch (error) {
        next(error);
    }
};

export {
    deleteOrganization,
    createOrganization
};
