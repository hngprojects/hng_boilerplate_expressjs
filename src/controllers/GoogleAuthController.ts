import passport from "../config/google.passport.config";
import { HttpError, ServerError, Unauthorized } from "../middleware";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import { GoogleAuthService } from "../services/google.passport.service";


export const initiateGoogleAuthRequest = passport.authenticate('google', { scope: [ 'openid', 'email', 'profile' ] })

export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    const authenticate = passport.authenticate('google', async (error, user, info) => {
        const googleAuthService = new GoogleAuthService();
      try {
        if (error) {            
            throw new ServerError("Authentication error");
        }
        if (!user) {
        throw new Unauthorized("Authentication failed!")
        }
        const isDbUser = await googleAuthService.getUserByGoogleId(user.id);
        const dbUser = await googleAuthService.handleGoogleAuthUser(user, isDbUser)        
        res.status(200).json(dbUser);
      } catch(error) {
        console.log(error);
        
        next(error)
      }
    });
    authenticate(req, res, next)
}