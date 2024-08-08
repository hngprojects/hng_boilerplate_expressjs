import AppDataSource from "../data-source";
import { FAQ } from "../models/faq";
import { Repository } from "typeorm";
import {
  BadRequest,
  HttpError,
  ResourceNotFound,
  Unauthorized,
} from "../middleware";

type FAQType = {
  question: string;
  answer: string;
  category: string;
  createdBy: string;
};

class FAQService {
  private faqRepository: Repository<FAQ>;
  constructor() {
    this.faqRepository = AppDataSource.getRepository(FAQ);
  }
  public async createFaq(data: FAQType): Promise<FAQ> {
    try {
      const faq = this.faqRepository.create(data);
      const createdFAQ = await this.faqRepository.save(faq);
      return createdFAQ;
    } catch (error) {
      throw new Error("Failed to create FAQ");
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
