import AppDataSource from "../data-source";
import { FAQ } from "../models/faq";
import { Repository } from "typeorm";
import { FAQResponse, FAQType } from "../types/faq";
import { QueryFailedError } from "typeorm";
import { asyncHandler } from "../utils/asyncHandler";
import {
  BadRequest,
  HttpError,
  ResourceNotFound,
  Unauthorized,
  ServerError,
  Conflict,
} from "../middleware";

class FAQService {
  private faqRepository: Repository<FAQ>;
  constructor() {
    this.faqRepository = AppDataSource.getRepository(FAQ);
  }

  public async createFaq(
    data: FAQType,
  ): Promise<{ status_code: number; message: string; data: FAQResponse }> {
    try {
      const existingFAQ = await this.faqRepository.findOne({
        where: { question: data.question },
      });

      if (existingFAQ) {
        throw new Conflict("FAQ with this question already exists");
      }

      const faq = this.faqRepository.create(data);
      const createdFAQ = await this.faqRepository.save(faq);

      const { createdBy, ...result } = createdFAQ;

      return {
        status_code: 201,
        message: "FAQ created successfully",
        data: result as FAQResponse,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error as any).code === "23505") {
          throw new Conflict("FAQ already exists with similar data");
        }
        throw new ServerError("Invalid data provided");
      }

      throw new ServerError(error.message || "Failed to create FAQ");
    }
  }

  public async updateFaq(payload: Partial<FAQ>, faqId: string) {
    const faq = await this.faqRepository.findOne({ where: { id: faqId } });

    if (!faq) {
      throw new BadRequest(`Invalid request data`);
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

  public async getAllFaqs(): Promise<FAQ[]> {
    try {
      const faqs = await this.faqRepository.find();
      return faqs;
    } catch (error) {
      throw new Error("Failed to fetch FAQs");
    }
  }

  public async deleteFaq(faqId: string) {
    const faq = await this.faqRepository.findOne({ where: { id: faqId } });

    if (!faq) {
      throw new BadRequest(`Invalid request data`);
    }

    try {
      const result = await this.faqRepository.delete(faqId);
      return result.affected !== 0;
    } catch (error) {
      throw new HttpError(500, "Deletion failed");
    }
  }
}

export { FAQService };
