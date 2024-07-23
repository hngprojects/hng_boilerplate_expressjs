// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import log from "../utils/logger";

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

  async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.deleteUserById(req.params.id);
      return res.status(200).json({
        status: 200,
        message: "User deleted successfully"
      });
    } catch (error) {
      log.error("Error deleting user", error.message);

      if (error.message === "User not found") {
        return res.status(404).json({
          status: 404,
          message: "User not found"
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error"
      });
    }
  }
}

export default UserController;
