import { NextFunction, Request, Response } from "express";
import config from "../config";
import { sendJsonResponse } from "../helpers";
import { BadRequest } from "../middleware";
import asyncHandler from "../middleware/asyncHandler";
import { User } from "../models";
import { AuthService } from "../services";
import { userLoginResponseDto } from "../utils/response-handler";
import { generateToken, verifyGoogleToken } from "../utils";

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

/**
 * @swagger
 * /api/v1/auth/magic-link:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Passwordless sign-in with email
 *     description: API endpoint to initiate passwordless sign-in by sending email to the registered user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Sign-in token sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Sign-in token sent to email
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const createMagicLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body?.email;
    const response = await authService.generateMagicLink(email);
    if (!response.ok) {
      return next(new BadRequest("Bad request"));
    }

    return sendJsonResponse(res, 200, response.message, {});
  },
);

/**
 * @swagger
 * /api/v1/auth/magic-link:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Authenticate user with magic link
 *     description: Validates the magic link token and authenticates the user
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Magic link token
 *       - in: query
 *         name: redirect
 *         schema:
 *           type: boolean
 *         description: Whether to redirect after authentication (true/false)
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: Bearer token for authentication
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Contains the hng_token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: user123
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                 access_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       302:
 *         description: Redirect to home page (when redirect=true)
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Request
 *       500:
 *         description: Internal server error
 *     security: []
 */

const authenticateUserMagicLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query?.token;
    if (!token) {
      return next(new BadRequest("Bad request"));
    }
    const response = await authService.validateMagicLinkToken(token as string);
    if (response.status !== "ok") {
      return next(new BadRequest("Invalid Request"));
    }
    const { access_token } = await authService.passwordlessLogin(
      response.userId,
    );
    let user: User = await User.findOne({
      where: { email: response.email },
    });

    const responseData = userLoginResponseDto(user);

    res.header("Authorization", access_token);
    res.cookie("hng_token", access_token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: config.NODE_ENV === "development" ? "lax" : "none",
      path: "/",
    });

    if (req.query?.redirect === "true") {
      return res.redirect("/");
    } else {
      return sendJsonResponse(
        res,
        200,
        "Sign-in successful",
        { user: responseData },
        access_token,
      );
    }
  },
);

/**
 * @swagger
 * /google-auth:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Google OAuth Authentication
 *     description: Authenticates a user via Google OAuth and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Google ID token obtained after Google OAuth sign-in
 *             required:
 *               - id_token
 *     responses:
 *       '200':
 *         description: User authenticated successfully (existing user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User authenticated successfully
 *                 access_token:
 *                   type: string
 *                   description: JWT access token
 *                 user:
 *                   type: object
 *                   description: Authenticated user information
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *       '201':
 *         description: User authenticated successfully (new user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User authenticated successfully
 *                 access_token:
 *                   type: string
 *                   description: JWT access token
 *                 user:
 *                   type: object
 *                   description: Authenticated user information
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Google ID token
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
const googleAuthCall = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id_token } = req.body;
    const userInfo = await verifyGoogleToken(id_token);
    const user = await authService.googleSignin(userInfo);
    const access_token = await generateToken({ user_id: user.userInfo.id });
    return sendJsonResponse(
      res,
      user.is_new_user ? 201 : 200,
      "User authenticated successfully",
      { user: user.userInfo },
      access_token,
    );
  },
);

/**
 * @swagger
 * /api/v1/auth/request/token:
 *   post:
 *     summary: Request a new OTP
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
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, invalid email
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

const requestToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const message = await authService.resendOtp(email);
    sendJsonResponse(res, 200, message.toString(), {});
  } catch (error) {
    next(error);
  }
};
export {
  authenticateUserMagicLink,
  createMagicLink,
  login,
  signUp,
  verifyOtp,
  googleAuthCall,
  requestToken,
}