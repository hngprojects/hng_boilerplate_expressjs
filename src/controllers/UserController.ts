import { NextFunction, Request, Response } from "express";
import { validate as isUUID } from "uuid";
import { sendJsonResponse } from "../helpers";
import { BadRequest, ResourceNotFound } from "../middleware";
import asyncHandler from "../middleware/asyncHandler";
import { UserService } from "../services";

const userservice = new UserService();
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
   *    summary: Get Authenticated User profile
   *    security:
   *      - bearerAuth: []
   *    description: Api endpoint to retrieve the profile data of the currently authenticated user. This will allow users to access their own profile information.
   *    responses:
   *      200:
   *        description: Fetched User profile successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *                  example: true
   *                status_code:
   *                  type: integer
   *                  example: 200
   *                message:
   *                  type: string
   *                  example: User profile details retrieved successfully
   *                data:
   *                  type: object
   *                  properties:
   *                    id:
   *                      type: string
   *                      example: 550e8400-e29b-41d4-a716-446655440000
   *                    first_name:
   *                      type: string
   *                      example: John
   *                    last_name:
   *                      type: string
   *                      example: Doe
   *                    type:
   *                      type: string
   *                      example: vendor
   *                    profile:
   *                      type: object
   *                      properties:
   *                        profile_id:
   *                          type: string
   *                          example: profile1
   *                        username:
   *                          type: string
   *                          example: johndoe
   *                        bio:
   *                          type: string
   *                          example: This is a bio
   *                        job_title:
   *                          type: string
   *                          example: Developer
   *                        language:
   *                          type: string
   *                          example: English
   *                        pronouns:
   *                          type: string
   *                          example: he/him
   *                        department:
   *                          type: string
   *                          example: Engineering
   *                        social_links:
   *                          type: array
   *                        profile_pic_url:
   *                          type: string
   *                          example: https://avatar.com
   *                        timezones:
   *                          type: string
   *                          example: UTC
   *      401:
   *        description: Unauthorized access
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *                  example: false
   *                status_code:
   *                  type: integer
   *                  example: 401
   *                message:
   *                  type: string
   *                  example: Unauthorized access
   *      404:
   *        description: Not found
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *                  example: false
   *                status_code:
   *                  type: integer
   *                  example: 404
   *                message:
   *                  type: string
   *                  example: User not found!
   *      500:
   *        description: Internal Server Error
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *                  example: false
   *                status_code:
   *                  type: integer
   *                  example: 500
   *                message:
   *                  type: string
   *                  example: Internal Server Error
   */
  public getUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.user;
      if (!id || !isUUID(id)) {
        return next(new BadRequest("Invalid or missing user ID!"));
      }

      const user = await userservice.getUserById(id);
      if (!user || user.deletedAt || user.is_deleted) {
        return next(new ResourceNotFound("User not found!"));
      }

      sendJsonResponse(
        res,
        200,
        "User profile details retrieved successfully",
        {
          id: user?.id,
          first_name: user?.first_name,
          last_name: user?.last_name,
          type: user?.user_type,
          profile: {
            profile_id: user?.profile?.id,
            username: user?.profile?.username,
            bio: user.profile?.bio,
            job_title: user?.profile?.jobTitle,
            language: user?.profile?.language,
            pronouns: user?.profile?.pronouns,
            department: user?.profile?.department,
            social_links: user?.profile?.social_links,
            profile_pic_url: user?.profile?.profile_pic_url,
            timezones: user?.profile?.timezones,
          },
        },
      );
    },
  );
}

export { UserController };
