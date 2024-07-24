// src/services/HelpService.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HelpCenterTopic } from "../models";
import { User } from "../models";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import config from "../config";

export class HelpService {
  public async create(req: Request): Promise<HelpCenterTopic> {
    try {
      const { title, content, author } = req.body;

      //Validate Input
      if (!title || !content || !author) {
        throw new HttpError(
          422,
          "Validation failed: Title, content, and author are required",
        );
      }

      //Check for Existing Title
      const articleRepository = AppDataSource.getRepository(HelpCenterTopic);
      const existingTitle = await articleRepository.findOne({
        where: { title },
      });
      if (existingTitle) {
        throw new HttpError(422, "Article already exists");
      }

      const articleEntity = articleRepository.create({
        title,
        content,
        author,
      });
      const article = await articleRepository.save(articleEntity);
      return article;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async update(req: Request): Promise<HelpCenterTopic> {
    try {
      const { title, content, author } = req.body;
      const article_id = req.params.id;

      //Get article repo
      const articleRepository = AppDataSource.getRepository(HelpCenterTopic);

      // Check if article exists
      const existingArticle = await articleRepository.findOne({
        where: { id: article_id },
      });

      if (!existingArticle) {
        throw new HttpError(404, "Not Found");
      }

      //Update Article on DB
      await articleRepository.update(article_id, { title, content, author });

      //Fetch Updated article
      const newArticle = await articleRepository.findOne({
        where: { id: article_id },
      });
      return newArticle;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
      status_code: 401,
    });
  }

  try {
    const verified = jwt.verify(token, config.TOKEN_SECRET);
    if (verified) {
      next();
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token",
      status_code: 401,
    });
  }
};

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

    if (user.role !== "admin") {
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
