import { Request, Response, NextFunction } from "express";
import { FAQController } from "../controllers";
import { FAQService } from "../services";
import { User } from "../models";

jest.mock("../services", () => ({
  FAQService: jest.fn().mockImplementation(() => ({
    createFaq: jest.fn(),
  })),
}));

jest.mock("../data-source", () => ({
  getRepository: jest.fn().mockReturnValue({
    findOneBy: jest.fn(),
  }),
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
  let userRepository: any;

  beforeEach(() => {
    faqController = new FAQController();
    faqService = new FAQService();
    userRepository = require("../data-source").getRepository(User);
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
