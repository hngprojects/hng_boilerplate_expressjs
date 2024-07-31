import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.services";
import passport from "passport";
import { generateAccessToken } from "../utils";
import { GoogleUserInfo } from "../services/google.auth.service";
import { User } from "../models";
import { verifyToken } from "../config/google.passport.config";
import jwt from "jsonwebtoken";
import config from "../config";

const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related routes
 */

/**
 * @swagger
 * api/v1/auth/register:
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
    const { mailSent, newUser, access_token } = await authService.signUp(
      req.body,
    );
    res.status(201).json({ mailSent, newUser, access_token });
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
// const forgotPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { email } = req.body;
//     const { message } = await authService.forgotPassword(email);
//     res.status(200).json({ status: "sucess", status_code: 200, message });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * @swagger
 * /api/v1/auth/resetPassword:
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
// const resetPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { token, newPassword } = req.body;
//     const { message } = await authService.resetPassword(token, newPassword);
//     res.status(200).json({ message });
//   } catch (error) {
//     next(error);
//   }
// };

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
 * /api/v1/auth/google-signin:
 *   post:
 *     summary: Handle Google authentication and register/login a user
 *     description: This endpoint handles Google OAuth2.0 authentication. It accepts a Google user payload and either registers a new user or logs in an existing one.
 *     tags:
 *       - Auth
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
 *                 description: The user's email address.
 *                 example: user@example.com
 *               email_verified:
 *                 type: boolean
 *                 description: Whether the user's email is verified.
 *                 example: true
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: "John Doe"
 *               picture:
 *                 type: string
 *                 format: url
 *                 description: URL to the user's profile picture.
 *                 example: "https://example.com/avatar.jpg"
 *               sub:
 *                 type: string
 *                 description: Google user ID (subject claim).
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Verify if authentication is successful
 *                   example: Authentication successful
 *                 user:
 *                   type: object
 *                   description: The authenticated user object.
 *                 access_token:
 *                   type: string
 *                   description: JWT access token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Invalid or missing data in request body
 *       500:
 *         description: Internal Server Error - An unexpected error occurred
 */

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
    console.error(error);
    res.status(400).json({ error: "Authentication failed" });
  }
};

/**
 * @swagger
 * /api/v1/auth/facebook:
 *   post:
 *     summary: Handle Facebook authentication and register/login a user
 *     description: This endpoint handles Facebook OAuth2.0 authentication. It accepts a Facebook user payload and either registers a new user or logs in an existing one.
 *     tags:
 *       - Auth
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
 *                 description: The user's email address.
 *                 example: user@example.com
 *               verified:
 *                 type: boolean
 *                 description: Whether the user's email is verified.
 *                 example: true
 *               first_name:
 *                 type: string
 *                 description: The user's first name.
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: The user's last name.
 *                 example: "Doe"
 *               picture:
 *                 type: string
 *                 format: url
 *                 description: URL to the user's profile picture.
 *                 example: "https://example.com/avatar.jpg"
 *               id:
 *                 type: string
 *                 description: facebook user ID (subject claim).
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Verify if authentication is successful
 *                   example: Authentication successful
 *                 data:
 *                   type: object
 *                   description: The authenticated user object.
 *                 access_token:
 *                   type: string
 *                   description: JWT access token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Invalid email. Email is required
 *       401:
 *         description: Unauthorized - Authentication failed
 *       500:
 *         description: Internal Server Error - An unexpected error occurred
 */

const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

const facebookAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "facebook",
    { session: false },
    async (error: any, user: User, info: any) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json({
          status_code: 401,
          message: "Authentication failed",
        });
      }

      const access_token = await generateAccessToken(user.facebook_id);
      res.status(200).json({
        status: "success",
        message: "User successfully authenticated",
        data: user,
        access_token: access_token,
      });
    },
  )(req, res, next);
};

export {
  signUp,
  verifyOtp,
  login,
  // forgotPassword,
  // resetPassword,
  changePassword,
  googleAuthCall,
  facebookAuth,
  facebookAuthCallback,
};
