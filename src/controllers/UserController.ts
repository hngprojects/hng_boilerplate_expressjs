import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";
import { sendJsonResponse } from "../helpers";
import { BadRequest, ResourceNotFound } from "../middleware";
import asyncHandler from "../middleware/asyncHandler";
import { UserService } from "../services";

class UserController {
  /**
   * @swagger
   * tags:
   *  name: User
   *  description: User related routes
   */
  /**
   * @swagger
   * /api/v1/users/me:
   *  get:
   *    tags:
   *      - User
   *    summary: Get User profile
   *    security:
   *      - bearerAuth: []
   *    description: Api endpoint to retrieve the profile data of the currently authenticated user. This will allow users to access their own profile information.
   *    responses:
   *      200:
   *        description: Fetched User profile Successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status_code:
   *                  type: integer
   *                  example: 200
   *                data:
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: string
   *                      example: 58b6
   *                    user_name:
   *                      type: string
   *                      example: yasuke
   *                    email:
   *                      type: string
   *                      example: sam@gmail.com
   *                    profile_picture:
   *                      type: string
   *                      example: https://avatar.com
   *
   *      401:
   *        description: Unauthorized access
   *      404:
   *        description: Not found
   *      500:
   *        description: Internal Server Error
   *
   */
  static getProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.user;

      if (!id) {
        throw new BadRequest("Unauthorized! No ID provided");
      }

      if (!validate(id)) {
        throw new BadRequest("Unauthorized! Invalid User Id Format");
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        throw new ResourceNotFound("User Not Found!");
      }

      if (user?.deletedAt || user?.is_deleted) {
        throw new ResourceNotFound("User not found!");
      }

      sendJsonResponse(
        res,
        200,
        "User profile details retrieved successfully",
        {
          id: user.id,
          first_name: user?.first_name,
          last_name: user?.last_name,
          profile_id: user?.profile?.id,
          username: user?.profile?.username,
          bio: user?.profile?.bio,
          jobTitle: user?.profile?.jobTitle,
          language: user?.profile?.language,
          pronouns: user?.profile?.pronouns,
          department: user?.profile?.department,
          social_links: user?.profile?.social_links,
          timezones: user?.profile?.timezones,
        },
      );
    },
  );

  /**
   * @swagger
   * /api/v1/users/me:
   *  put:
   *    tags:
   *      - User
   *    summary: Update User profile
   *    security:
   *      - bearerAuth: []
   *    description: Api endpoint to update the profile data of the currently authenticated user.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              first_name:
   *                type: string
   *                example: Yasuke
   *              last_name:
   *                type: string
   *                example: Shimazu
   *              username:
   *                type: string
   *                example: yasuke
   *              bio:
   *                type: string
   *                example: Samurai from Africa
   *              jobTitle:
   *                type: string
   *                example: Warrior
   *              language:
   *                type: string
   *                example: Japanese
   *              pronouns:
   *                type: string
   *                example: he/him
   *              department:
   *                type: string
   *                example: Military
   *              social_links:
   *                type: array
   *                items:
   *                  type: string
   *                example: ["https://twitter.com/yasuke"]
   *              timezones:
   *                type: string
   *                example: "Asia/Tokyo"
   *    responses:
   *      200:
   *        description: Updated User profile Successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status_code:
   *                  type: integer
   *                  example: 200
   *                data:
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: string
   *                      example: 58b6
   *                    user_name:
   *                      type: string
   *                      example: yasuke
   *                    email:
   *                      type: string
   *                      example: sam@gmail.com
   *                    profile_picture:
   *                      type: string
   *                      example: https://avatar.com
   *      400:
   *        description: Bad request
   *      401:
   *        description: Unauthorized access
   *      404:
   *        description: Not found
   *      500:
   *        description: Internal Server Error
   *
   */
  static updateProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.user;
      const {
        first_name,
        last_name,
        username,
        bio,
        jobTitle,
        language,
        pronouns,
        department,
        social_links,
        timezones,
      } = req.body;

      if (!id) {
        throw new BadRequest("Unauthorized! No ID provided");
      }

      if (!validate(id)) {
        throw new BadRequest("Unauthorized! Invalid User Id Format");
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        throw new ResourceNotFound("User Not Found!");
      }

      if (user?.deletedAt || user?.is_deleted) {
        throw new ResourceNotFound("User not found!");
      }

      const updatedUser = await UserService.updateUserById(id, {
        first_name,
        last_name,
        username,
        bio,
        jobTitle,
        language,
        pronouns,
        department,
        social_links,
        timezones,
      });

      sendJsonResponse(res, 200, "User profile updated successfully", {
        id: updatedUser.id,
        first_name: updatedUser?.first_name,
        last_name: updatedUser?.last_name,
        profile_id: updatedUser?.profile?.id,
        username: updatedUser?.profile?.username,
        bio: updatedUser?.profile?.bio,
        jobTitle: updatedUser?.profile?.jobTitle,
        language: updatedUser?.profile?.language,
        pronouns: updatedUser?.profile?.pronouns,
        department: updatedUser?.profile?.department,
        social_links: updatedUser?.profile?.social_links,
        timezones: updatedUser?.profile?.timezones,
      });
    },
  );
}

export { UserController };
