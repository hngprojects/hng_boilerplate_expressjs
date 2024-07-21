// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { validateUserProfileUpdate } from "../middleware/userpreference.validation"; // Validator function to validate the payload


class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }



  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const updates = req.body;

      // Validate incoming data
      const validationErrors = validateUserProfileUpdate(updates);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: "Unable to update profile",
          errors: validationErrors,
          status_code: 400,
        });
      }

      const updatedUser = await this.userService.updateUserProfile(userId, updates);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found", status_code: 404 });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
        status: 200,
      });
    } catch (error) {
      if (error.message === "Email address already in use") {
        return res.status(409).json({
          message: "Unable to update profile",
          errors: [error.message],
          status_code: 409,
        });
      }
      res.status(500).json({ message: "Internal server error", status_code: 500 });
    }
  }
}

export default UserController;
