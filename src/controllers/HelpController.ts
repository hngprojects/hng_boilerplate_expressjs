// src/controllers/UserController.ts
import { Request, Response } from "express";
import { HelpService } from "../services/help.services";
import { HttpError } from "../middleware";

class HelpController {
  private helpService: HelpService;

  constructor() {
    this.helpService = new HelpService();
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, author } = req.body;

      //Validate Input
      if (!title || !content || !author) {
        throw new HttpError(
          422,
          "Validation failed: Title, content, and author are required",
        );
      }

      const topic = await this.helpService.create(title, content, author);
      res.status(201).json({
        success: true,
        message: "Topic Created Successfully",
        data: {
          article_id: topic.id,
          content: topic.content,
          author: topic.author,
          title: topic.title,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
        status_code: 201,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async getAllTopics(req: Request, res: Response): Promise<void> {
    try {
      const topics = await this.helpService.getAll();
      res.status(201).json({
        success: true,
        message: "Fetch Successful",
        data: topics,
        status_code: 201,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async getTopicById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id);

      //Validate Input
      if (!id) {
        throw new HttpError(422, "Validation failed: Valid ID required");
      }
      const topic = await this.helpService.getTopicById(id);
      res.status(201).json({
        success: true,
        message: "Fetch Successful",
        data: topic,
        status_code: 201,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(error.status_code || 500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }

  async updateTopic(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, author } = req.body;
      const id = req.params.id;

      //Validate Input
      if (!title || !content || !author) {
        throw new HttpError(
          422,
          "Validation failed: Title, content, and author are required",
        );
      }

      //Validate ID
      if (!id) {
        throw new HttpError(422, "Invalid topic id");
      }

      const topic = await this.helpService.update(id, title, content, author);
      res.status(200).json({
        success: true,
        message: "Topic Updated Successfully",
        data: {
          article_id: topic.id,
          content: topic.content,
          author: topic.author,
          title: topic.title,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        },
        status_code: 200,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status_code).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    }
  }
}

export default HelpController;
