import { FaqService } from "../services";
import { Repository } from "typeorm";
import { FAQ } from "../models/faq";
import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";

jest.mock("../data-source");

describe("FaqService", () => {
  let faqService: FaqService;
  let faqRepository: jest.Mocked<Repository<FAQ>>;

  beforeEach(() => {
    faqRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    } as any;

    AppDataSource.getRepository = jest.fn().mockImplementation((model) => {
      if (model === FAQ) {
        return faqRepository;
      }
      throw new Error("Unknown model");
    });

    faqService = new FaqService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateFaq", () => {
    // it("should update an existing FAQ", async () => {
    //     const faqId = "faq-123";
    //     const payload = { title: "Updated FAQ title", content: "Updated content" };
    //     const existingFaq = {
    //         id: faqId,
    //         title: "Old FAQ title",
    //         content: "Old content",
    //     } as FAQ;

    //     faqRepository.findOne.mockResolvedValue(existingFaq);
    //     faqRepository.save.mockResolvedValue({
    //         ...existingFaq,
    //         ...payload,
    //         updatedAt: new Date(),
    //     } as FAQ);

    //     const result = await faqService.updateFaq(payload, faqId);

    //     expect(faqRepository.findOne).toHaveBeenCalledWith({ where: { id: faqId } });
    //     expect(faqRepository.update).toHaveBeenCalledWith({
    //         faqId,
    //         ...payload,
    //     });
    //     expect(result).toEqual({
    //         ...existingFaq,
    //         ...payload,
    //         updatedAt: expect.any(Date),
    //     });
    // });

    it("should throw ResourceNotFound if FAQ does not exist", async () => {
      const faqId = "faq-123";
      const payload = {
        title: "Updated FAQ title",
        content: "Updated content",
      };

      faqRepository.findOne.mockResolvedValue(null);

      await expect(faqService.updateFaq(payload, faqId)).rejects.toThrow(
        ResourceNotFound,
      );
    });
  });
});
