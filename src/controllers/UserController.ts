// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services";
import { HttpError } from "../middleware";
import { isUUID } from "class-validator";

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
    const id = req.params.id;

    if (!id || !isUUID(id)) {
      return res.status(400).json({
                                status: "unsuccesful",
                                status_code: 400,
                                message: "Valid id must be provided",
                              });
    }

    try {

      await this.userService.softDeleteUser(id);

      return res.status(202).json({
                              status: "sucess",
                              message: "User deleted successfully",
                              status_code: 202,
                            });
      
    } catch (error) {
      
      if (error instanceof HttpError) {
        return res.status(error.status_code).json({
          message: error.message
        });
      } else {
        return res.status(500).json({
          message: error.message || "Internal Server Error"
        });
      }

    }
  }
}

export default UserController;
