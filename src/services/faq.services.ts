import AppDataSource from "../data-source";
import { FAQ } from "../models/faq";
import { Repository } from "typeorm";

const faqRepository: Repository<FAQ> = AppDataSource.getRepository(FAQ);

class FAQService {
  public async createFaq(data: Partial<FAQ>): Promise<FAQ> {
    try {
      const faq = faqRepository.create(data);
      const createdFAQ = await faqRepository.save(faq);
      return createdFAQ;
    } catch (error) {
      throw new Error("Failed to create FAQ");
    }
  }
}

export { FAQService };
