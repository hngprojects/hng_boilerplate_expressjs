import AppDataSource from "../data-source";
import { FAQ } from "../models/faq";
import { Repository } from "typeorm";

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
}

export { FAQService };
