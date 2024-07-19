// // src/controllers/UserController.ts
import { Request, Response } from "express";

import { User } from "../models";

class UserController {
  static async getUser(req: Request, res: Response) {
    const user = await User.findOne({
      where: { id: req.params.id },
      relations: ["profile", "products", "organizations"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  }
  static async getAllUsers(req: Request, res: Response) {
    const users = await User.find({
      relations: ["profile", "products", "organizations"],
    });

    res.json(users);
  }
}

export default UserController;

{
  relations: ["profile", "products", "organizations"];
}
