import { NextFunction, Request, Response } from "express";
import { validate } from "uuid";
import { UserService } from "../services";
import { BadRequest, ResourceNotFound } from "../middleware";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

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
          job_title: user?.profile?.jobTitle,
          language: user?.profile?.language,
          pronouns: user?.profile?.pronouns,
          department: user?.profile?.department,
          social_links: user?.profile?.social_links,
          timezones: user?.profile?.timezones,
        },
      );
    },
  );
}

export { UserController };
