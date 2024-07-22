import { Request, Response } from "express";
import { UserService } from "../services/user.services";

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

  // New method to get organizations for a user with pagination
  async getUserOrganizations(req: Request, res: Response) {
    const userId = req.params.user_id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    try {
      const result = await this.userService.getUserOrganizations(userId, page, limit);
      res.status(200).json({
        status: "success",
        message: result.organisations.length ? "Organizations retrieved successfully" : "No organizations found for the user",
        data: result
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: "Unauthorized access or user not found",
        status_code: 404
      });
    }
  }
}

export default UserController;
