import { Request, Response, NextFunction } from "express";
import { FAQController } from "../controllers";
import { FAQService } from "../services";
import { FAQ, User } from "../models";
import AppDataSource from "../data-source";
import { Repository } from "typeorm";

jest.mock("../services", () => ({
  FAQService: jest.fn().mockImplementation(() => ({
    createFaq: jest.fn(),
  })),
}));

// jest.mock("../data-source", () => ({
//   getRepository: jest.fn().mockReturnValue({
//     findOneBy: jest.fn(),
//   }),
// }));

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));

const mockRequest = (body: any, user: any) =>
  ({
    body,
    user,
  }) as unknown as Request;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("FAQController", () => {
  let faqController: FAQController;
  let faqService: FAQService;
  let faqRepositoryMock: jest.Mocked<Repository<FAQ>>;

  beforeEach(() => {
    faqController = new FAQController();
    faqService = new FAQService();
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === FAQ) return faqRepositoryMock;
      return {};
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    const req = mockRequest(
      {
        question: "What is organization?",
        answer: "It's a group of people.",
        category: "general",
      },
      null,
    );
    const res = mockResponse();

    await faqController.createFAQ(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status_code: 401,
      success: false,
      message: "User not authenticated",
    });
  });
});
