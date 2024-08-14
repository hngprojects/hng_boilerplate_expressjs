import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services";
import { sendJsonResponse } from "../helpers";

const authService = new AuthService();

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, access_token, message } = await authService.signUp(req.body);
    sendJsonResponse(res, 201, message, { user, access_token });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, access_token } = await authService.verifyEmail(
      req.body.token,
      req.body.email
    );
    sendJsonResponse(res, 200, message, { access_token });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, access_token, message } = await authService.login({
      email,
      password,
    });
    sendJsonResponse(res, 200, message, { user, access_token });
  } catch (error) {
    next(error);
  }
};

export { signUp, verifyOtp, login };
