import AppDataSource from "../data-source";
import { FAQ } from "../models/faq";

const faqRepository = AppDataSource.getRepository(FAQ);

class FAQService {
  public async createFaq(data: Partial<FAQ>): Promise<FAQ> {
    const faq = faqRepository.create(data);
    const createdFAQ = await faqRepository.save(faq);
    return createdFAQ;
  }
}

export { FAQService };
