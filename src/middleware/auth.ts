import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
    user?: any;
}
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({ message: "JWT token is invalid.", status: 400 });
            }
            (req as CustomRequest).user = user; next();
        });
    }
    else {
        return res.status(401).json({ message: "JWT token is missing or invalid.", status: 401 });
    }
}