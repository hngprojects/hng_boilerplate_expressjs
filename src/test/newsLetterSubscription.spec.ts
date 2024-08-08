import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";
import { BadRequest } from "../middleware";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  verifyToken: jest.fn(),
}));

jest.mock("../models");
jest.mock("../utils");

describe("NewsLetterSubscriptionService", () => {
  let newsLetterSubscriptionService: NewsLetterSubscriptionService;
  let newsLetterRepositoryMock: jest.Mocked<Repository<NewsLetterSubscriber>>;

  beforeEach(() => {
    newsLetterRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === NewsLetterSubscriber) return newsLetterRepositoryMock;
    });

    newsLetterSubscriptionService = new NewsLetterSubscriptionService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("SubscribeToNewsLetter", () => {
    it("should subscribe a new user", async () => {
      const newSubscriber = new NewsLetterSubscriber();
      newSubscriber.email = "test1@example.com";

      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      (newsLetterRepositoryMock.save as jest.Mock).mockImplementation(
        (user) => {
          user.id = "456";
          return Promise.resolve(user);
        },
      );

      const result =
        await newsLetterSubscriptionService.subscribeUser("test1@example.com");

      expect(result.isNewlySubscribe).toBe(true);
      expect(result.subscriber).toEqual({
        id: "456",
        email: "test1@example.com",
        isSubscribe: true,
      });
      expect(newsLetterRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test1@example.com",
          isSubscribe: true,
        }),
      );
    });

    it("should handle an already subscribed user", async () => {
      const existingSubscriber = new NewsLetterSubscriber();
      existingSubscriber.id = "123";
      existingSubscriber.email = "test@example.com";
      existingSubscriber.isSubscribe = true;

      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(
        existingSubscriber,
      );

      const result =
        await newsLetterSubscriptionService.subscribeUser("test@example.com");

      expect(result.isNewlySubscribe).toBe(false);
      expect(result.subscriber).toEqual({
        id: "123",
        email: "test@example.com",
        isSubscribe: true,
      });
      expect(newsLetterRepositoryMock.save).not.toHaveBeenCalled();
    });

    it("should throw a Conflict error if already subscribed but inactive", async () => {
      const inactiveSubscriber = new NewsLetterSubscriber();
      inactiveSubscriber.email = "test@example.com";
      inactiveSubscriber.isSubscribe = false;

      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(
        inactiveSubscriber,
      );

      await expect(
        newsLetterSubscriptionService.subscribeUser("test@example.com"),
      ).rejects.toThrow(BadRequest);
    });

    it("should throw an error if something goes wrong", async () => {
      (newsLetterRepositoryMock.findOne as jest.Mock).mockRejectedValue(
        new Error("An error occurred while processing your request"),
      );

      await expect(
        newsLetterSubscriptionService.subscribeUser("test@example.com"),
      ).rejects.toThrow("An error occurred while processing your request");
    });
  });
});
