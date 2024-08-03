// src/services/HelpService.ts
import { HelpCenterEntity } from "../models";
import AppDataSource from "../data-source";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { DeleteResult, Repository } from "typeorm";

export class HelpService {
  private helpRepository: Repository<HelpCenterEntity>;

  constructor() {
    this.helpRepository = AppDataSource.getRepository(HelpCenterEntity);
  }

  public async create(
    title: string,
    content: string,
    author: string,
  ): Promise<{ article: HelpCenterEntity; message: string }> {
    try {
      //Check for Existing Title
      const existingTitle = await this.helpRepository.findOne({
        where: { title },
      });
      if (existingTitle) {
        throw new Conflict("Article already exists");
      }

      const articleEntity = this.helpRepository.create({
        title,
        content,
        author,
      });
      const article = await this.helpRepository.save(articleEntity);
      return {
        article: article,
        message: "Article Created Succesfully",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async getAll(): Promise<{
    articles: HelpCenterEntity[];
    message: string;
  }> {
    try {
      const articles = await this.helpRepository.find();
      return {
        articles: articles,
        message: "Fetch Succesful",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async update(
    id: string,
    title: string,
    content: string,
    author: string,
  ): Promise<{ article: HelpCenterEntity; message: string }> {
    try {
      const article_id = id;

      // Check if article exists
      const existingArticle = await this.helpRepository.findOne({
        where: { id: article_id },
      });

      if (!existingArticle) {
        throw new ResourceNotFound("Article Not Found");
      }

      //Update Article on DB
      await this.helpRepository.update(article_id, { title, content, author });

      //Fetch Updated article
      const newArticle = await this.helpRepository.findOne({
        where: { id: article_id },
      });
      return {
        article: newArticle,
        message: "Fetch Succesful",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async getTopicById(
    id: string,
  ): Promise<{ article: HelpCenterEntity; message: string }> {
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

      return {
        article: article,
        message: "Fetch Succesful",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async delete(
    id: string,
  ): Promise<{ article: DeleteResult; message: string }> {
    try {
      const article_id = id;

      // Check if article exists
      const existingArticle = await this.helpRepository.findOne({
        where: { id: article_id },
      });

      if (!existingArticle) {
        throw new ResourceNotFound("Article Not Found");
      }

      //Delete article
      const article = await this.helpRepository.delete({ id: article_id });
      return {
        article: article,
        message: "Delete Succesful",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
