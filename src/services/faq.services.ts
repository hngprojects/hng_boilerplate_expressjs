// src/services/HelpService.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { FAQ } from "../models";
import { User } from "../models";
import AppDataSource from "../data-source";
import { HttpError, ResourceNotFound } from "../middleware";
import config from "../config";
import { DeleteResult, Repository } from "typeorm";
import { validate } from "class-validator";

export class FaqService {
  private faqRepository: Repository<FAQ>;

  constructor() {
    this.faqRepository = AppDataSource.getRepository(FAQ);
  }

  public async create_Faq(
    title: string,
    content: string,
    author: string,
  ): Promise<FAQ> {
    try {
      //Check for Existing Faq title
      const title_exists = await this.faqRepository.findOne({
        where: { title },
      });
      if (title_exists) {
        throw new HttpError(422, "Article already exists");
      }

      const faq = this.faqRepository.create({
        title,
        content,
        author,
      });
      const newFaq = await this.faqRepository.save(faq);
      return newFaq;
    } catch (error) {
      throw new HttpError(error.status_code, error.message || error);
    }
  }

  public async getAll_Faq(): Promise<FAQ[]> {
    try {
      const faq = await this.faqRepository.find();
      return faq;
    } catch (error) {
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async updateFaq(payload: Partial<FAQ>, faqId: string) {
    const faq = await this.faqRepository.findOne({ where: { id: faqId } });

    if (!faq) {
      throw new ResourceNotFound(`Faq with ID ${faqId} not found`);
    }

    Object.assign(faq, payload);

    try {
      await this.faqRepository.update(faqId, payload);
      const updatedFaq = await this.faqRepository.findOne({
        where: { id: faqId },
      });
      return updatedFaq;
    } catch (error) {
      throw error;
    }
  }
}
