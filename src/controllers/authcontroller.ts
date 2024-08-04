import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services";
import { sendJsonResponse } from "../helpers";
import { verifyToken } from "../utils/verifyGoogleToken";
import jwt from "jsonwebtoken";
import config from "../config";
import { generateAccessToken } from "../utils";

const authService = new AuthService();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *               admin_secret:
 *                 type: string
 *                 example: supersecretkey123
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User Created Successfully, Kindly check your mail for your verification token
 *                 status_code:
 *                   type: number
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                         avatar_url:
 *                           type: string
 *                         role:
 *                           type: string
 *                 access_token:
 *                   type: string
 *       409:
 *         description: User already exists
 *       500:
 *         description: Some server error
 */

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, access_token, message } = await authService.signUp(req.body);
    sendJsonResponse(res, 201, message, { user, access_token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related routes
 */

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - token
 *               - email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                     user_name:
 *                       type: string
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Bad request, invalid OTP or email
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, access_token } = await authService.verifyEmail(
      req.body.token,
      req.body.email,
    );
    sendJsonResponse(res, 200, message, { access_token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                     user_name:
 *                       type: string
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

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

const googleAuthCall = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id_token } = req.body;
    const userInfo = await verifyToken(id_token);
    const user = await authService.googleSignin(userInfo);
    const token = await generateAccessToken(user.userInfo.id);

    res.status(user.is_new_user ? 201 : 200).json({
      status: "success",
      message: "User authenticated successfully",
      access_token: token,
      user: user.userInfo,
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, verifyOtp, login, googleAuthCall };
