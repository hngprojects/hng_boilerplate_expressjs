// src/services/HelpService.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HelpCenterTopic } from "../models";
import { User } from "../models";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import config from "../config";
import { Repository } from "typeorm";

export class HelpService {
  private helpRepository: Repository<HelpCenterTopic>;

  constructor() {
    this.helpRepository = AppDataSource.getRepository(HelpCenterTopic);
  }

  public async create(
    title: string,
    content: string,
    author: string,
  ): Promise<HelpCenterTopic> {
    try {
      //Check for Existing Title
      const existingTitle = await this.helpRepository.findOne({
        where: { title },
      });
      if (existingTitle) {
        throw new HttpError(422, "Article already exists");
      }

      const articleEntity = this.helpRepository.create({
        title,
        content,
        author,
      });
      const article = await this.helpRepository.save(articleEntity);
      return article;
    } catch (error) {
      throw new HttpError(error.status_code, error.message || error);
    }
  }

  public async getAll(): Promise<HelpCenterTopic[]> {
    try {
      const articles = await this.helpRepository.find();
      return articles;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async update(
    id: string,
    title: string,
    content: string,
    author: string,
  ): Promise<HelpCenterTopic> {
    try {
      const article_id = id;

      // Check if article exists
      const existingArticle = await this.helpRepository.findOne({
        where: { id: article_id },
      });

      if (!existingArticle) {
        throw new HttpError(404, "Not Found");
      }

      //Update Article on DB
      await this.helpRepository.update(article_id, { title, content, author });

      //Fetch Updated article
      const newArticle = await this.helpRepository.findOne({
        where: { id: article_id },
      });
      return newArticle;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async getTopicById(id: string): Promise<HelpCenterTopic> {
    try {
      const article_id = id;

      // Check if article exists
      const existingArticle = await this.helpRepository.findOne({
        where: { id: article_id },
      });

      if (!existingArticle) {
        throw new HttpError(404, "Not Found");
      }

      //Fetch Updated article
      const article = await this.helpRepository.findOne({
        where: { id: article_id },
      });

      return article;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.decode(token);

    if (typeof decodedToken === "string" || !decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token",
        status_code: 401,
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decodedToken.userId },
    });

    if (user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! You are not an admin",
        status_code: 403,
      });
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: "error", message: "Access denied. Invalid token" });
  }
};
