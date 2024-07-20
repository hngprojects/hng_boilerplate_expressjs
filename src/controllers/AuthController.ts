import { Request, Response, NextFunction } from "express";

import { AuthService } from "../services";

/*
 *TODO: add validation
 */
const authService = new AuthService();
const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mailSent, newUser, access_token } = await authService.signUp(
      req.body
    );
    res.status(201).json({ mailSent, newUser, access_token });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, token } = req.body;
    const { message } = await authService.verifyEmail(token as string, otp);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export { signUp, verifyOtp };
