import { FAQService } from "../services";
import { Repository } from "typeorm";
import { FAQ } from "../models/faq";
import AppDataSource from "../data-source";
import { BadRequest, HttpError } from "../middleware";

jest.mock("../data-source");

describe("FaqService", () => {
  let faqService: FAQService;
  let faqRepository: jest.Mocked<Repository<FAQ>>;

  beforeEach(() => {
    faqRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    AppDataSource.getRepository = jest.fn().mockImplementation((model) => {
      if (model === FAQ) {
        return faqRepository;
      }
      throw new Error("Unknown model");
    });

    faqService = new FAQService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateFaq", () => {
    it("should update an existing FAQ", async () => {
      const faqId = "faq-123";
      const payload = {
        question: "Updated FAQ question",
        answer: "Updated FAQ answer",
        category: "General",
      };

      const existingFaq = new FAQ();
      existingFaq.id = faqId;
      existingFaq.question = "Old FAQ question";
      existingFaq.answer = "Old FAQ answer";
      existingFaq.category = "General";
      existingFaq.createdBy = "user-123";

      const updatedFaq = new FAQ();
      Object.assign(updatedFaq, existingFaq, payload);

      faqRepository.findOne.mockResolvedValueOnce(existingFaq);
      faqRepository.update.mockResolvedValueOnce({} as any);
      faqRepository.findOne.mockResolvedValue(updatedFaq);

      const result = await faqService.updateFaq(payload, faqId);

      expect(faqRepository.findOne).toHaveBeenCalledWith({
        where: { id: faqId },
      });
      expect(faqRepository.update).toHaveBeenCalledWith(faqId, payload);
      expect(faqRepository.findOne).toHaveBeenCalledWith({
        where: { id: faqId },
      });
      expect(result).toEqual({
        ...updatedFaq,
        id: faqId,
        createdBy: undefined,
      });
    });

    it("should throw BadRequest if FAQ does not exist", async () => {
      const faqId = "faq-123";
      const payload = {
        question: "Updated FAQ question",
        answer: "Updated FAQ answer",
        category: "General",
      };

      faqRepository.findOne.mockResolvedValue(null);

      await expect(faqService.updateFaq(payload, faqId)).rejects.toThrow(
        BadRequest,
      );
    });
  });

  describe("deleteFaq", () => {
    it("should delete an existing FAQ", async () => {
      const faqId = "faq-123";
      const existingFaq = {
        id: faqId,
        question: "FAQ question",
        answer: "Answer",
        category: "General",
      } as FAQ;

      faqRepository.findOne.mockResolvedValue(existingFaq);
      faqRepository.delete.mockResolvedValue({ affected: 1, raw: [] });

      const result = await faqService.deleteFaq(faqId);

      expect(faqRepository.findOne).toHaveBeenCalledWith({
        where: { id: faqId },
      });
      expect(faqRepository.delete).toHaveBeenCalledWith(faqId);
      expect(result).toBe(true);
    });

    it("should throw BadRequest if FAQ does not exist", async () => {
      const faqId = "faq-123";

      faqRepository.findOne.mockResolvedValue(null);

      await expect(faqService.deleteFaq(faqId)).rejects.toThrow(BadRequest);
    });

    it("should throw HttpError if deletion fails", async () => {
      const faqId = "faq-123";
      const existingFaq = {
        id: faqId,
        question: "FAQ question",
        answer: "Answer",
        category: "General",
      } as FAQ;

      faqRepository.findOne.mockResolvedValue(existingFaq);
      faqRepository.delete.mockResolvedValue({ affected: 0, raw: [] });
    });
  });
});
