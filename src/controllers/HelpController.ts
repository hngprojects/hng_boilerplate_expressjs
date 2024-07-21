// src/controllers/UserController.ts
import { Request, Response } from "express";
import { HelpService } from "../services";
import { HttpError } from "../middleware";

class HelpController {
  private helpService: HelpService;

  constructor() {
    this.helpService = new HelpService();
  }

  async createTopic(req: Request, res:Response):Promise<void> {
    try {
        const topic = await this.helpService.create(req);
        res.status(201).json({
            success: true,
            message: 'Topic Created Successfully',
            data: {
            article_id: topic.id,
            content: topic.content,
            author: topic.author,
            title: topic.title,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt
            },
            status_code: 201
        });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({message: error.message});
        } else {
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
  }

  async updateTopic(req: Request, res:Response):Promise<void> {
    try {
        const topic = await this.helpService.update(req);
        res.status(200).json({
            success: true,
            message: 'Topic Updated Successfully',
            data: {
              article_id: topic.id,
              content: topic.content,
              author: topic.author,
              title: topic.title,
              createdAt: topic.createdAt,
              updatedAt: topic.updatedAt
            },
            status_code: 200
          });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.status).json({message: error.message});
        } else {
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
  }
}

export default HelpController;