import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { verifyToken } from "../config/google.passport.config";
import { BadRequest } from "../middleware";
import { User } from "../models";
import { AuthService } from "../services/auth.services";
import { GoogleUserInfo } from "../services/google.auth.service";
import RequestUtils from "../utils/request.utils";

const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related routes
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string

 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mailSent:
 *                   type: string
 *                 newUser:
 *                   type: object
 *                 access_token:
 *                   type: string
 *       409:
 *         description: User already exists
 *       500:
 *         description: Some server error
 */

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, user, access_token } = await authService.signUp(req.body);
    res.status(201).json({ message, user, access_token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify the user's email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: integer
 *                 description: The OTP sent to the user's email
 *               token:
 *                 type: string
 *                 description: The token received during sign up
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid OTP or verification token has expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, token } = req.body;
    const { message } = await authService.verifyEmail(token as string, otp);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
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
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token, user } = await authService.login(req.body);
    res.status(200).json({ access_token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     description: Allows a user to request a password reset link by providing their email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Successfully requested password reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the request.
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   description: The HTTP status code.
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: The message indicating the result of the request.
 *                   example: Password reset link sent to your email.
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error.
 */

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const resetURL = `${req.protocol}://${req.get("host")}/${config["api-prefix"]}/auth/reset-password/`;
    const { message } = await authService.forgotPassword(email, resetURL);

    res.status(200).json({ status: "sucess", status_code: 200, message });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/reset-password/:token:
 *   post:
 *     summary: Reset a user's password
 *     description: Allows a user to reset their password by providing a valid reset token and a new password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: new_secure_password
 *     responses:
 *       200:
 *         description: Successfully reset password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The message indicating the result of the password reset.
 *                   example: Password has been reset successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const { message } = await authService.resetPassword(token, newPassword);
    res.status(200).json({ status: "success", status_code: 200, message });
  } catch (error) {
    next(error);
  }
};
/**
 * @swagger
 * /api/v1/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password of the user
 *               newPassword:
 *                 type: string
 *                 description: New password to set for the user
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully."
 *       400:
 *         description: Bad request, such as mismatched passwords or invalid input
 *       401:
 *         description: Unauthorized, invalid credentials or not authenticated
 *       500:
 *         description: Some server error
 */
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;
    const { message } = await authService.changePassword(
      userId,
      oldPassword,
      newPassword,
      confirmPassword,
    );
    res.status(200).json({ message });
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
const createMagicToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.body?.email;
    if (!email) {
      throw new BadRequest("Email is missing in request body.");
    }
    const response = await authService.generateMagicLink(email);
    if (!response.ok) {
      throw new BadRequest("Error processing request");
    }
    const requestUtils = new RequestUtils(req, res);
    requestUtils.addDataToState("localUser", response.user);

    return res.status(200).json({
      status_code: 200,
      message: response.message,
    });
  } catch (error) {
    next(error);
  }
};

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
const authenticateUserMagicLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token;
    const response = await authService.validateMagicLinkToken(token as string);
    if (response.status !== "ok") {
      throw new BadRequest("Invalid Request");
    }
    const { access_token } = await authService.passwordlessLogin(
      response.userId,
    );

    const requestUtils = new RequestUtils(req, res);
    let user: User = requestUtils.getDataFromState("local_user");
    if (!user?.email && !user?.id) {
      user = await User.findOne({
        where: { email: response.email },
      });
    }

    const responseData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

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
      return res.status(200).json({
        status_code: 200,
        data: responseData,
        access_token,
      });
    }
  } catch (err) {
    if (err instanceof BadRequest) {
      return res.status(400).json({ status: "error", message: err.message });
    }
    next(err);
  }
};

const googleAuthCall = async (req: Request, res: Response) => {
  try {
    const { id_token } = req.body;

    // Verify the ID token from google
    const userInfo = await verifyToken(id_token);

    // update user info
    const user = await GoogleUserInfo(userInfo);

    // generate access token for the user
    const token = jwt.sign({ userId: user.id }, config.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Return the JWT and User
    res.json({ user, access_token: token });
  } catch (error) {
    res.status(400).json({ error: "Authentication failed" });
  }
};

export {
  authenticateUserMagicLink,
  changePassword,
  createMagicToken,
  forgotPassword,
  googleAuthCall,
  // handleGoogleAuth,
  login,
  resetPassword,
  signUp,
  verifyOtp,
};
