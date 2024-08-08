import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";

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
  let newsLetterRepositoryMock: jest.Mocked<
    Repository<NewsLetterSubscriptionService>
  >;

  beforeEach(() => {
    newsLetterRepositoryMock = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
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
      const user = new NewsLetterSubscriber();
      user.email = "test@example.com";

      const payload = {
        email: "test1@example.com",
      };

      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      (newsLetterRepositoryMock.save as jest.Mock).mockImplementation(
        (user) => {
          user.id = "456";
          return Promise.resolve(user);
        },
      );
      const result =
        await newsLetterSubscriptionService.subscribeUser("test1@example.com");

      expect(result.isSubscribe).toBe(false);
      expect(result.subscriber).toEqual({
        id: "456",
        email: "test1@example.com",
      });
      expect(newsLetterRepositoryMock.save).toHaveBeenCalled();
    });

    it("should handle already subscribed user", async () => {
      const user = new NewsLetterSubscriber();
      user.id = "123";
      user.email = "test@example.com";
      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(user);
      (newsLetterRepositoryMock.save as jest.Mock).mockImplementation(
        (user) => {
          user.id = "456";
          return Promise.resolve(user);
        },
      );
      const result =
        await newsLetterSubscriptionService.subscribeUser("test@example.com");

      expect(result.isSubscribe).toBe(true);
      expect(result.subscriber).toEqual({
        id: "123",
        email: "test@example.com",
      });
      expect(newsLetterRepositoryMock.save).not.toHaveBeenCalled();
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

  describe("fetchAllNewsletter", () => {
    it("should fetch all newsletters with pagination", async () => {
      const page = 2;
      const limit = 20;
      const mockSubscribers: any = [
        { id: "1", email: "user1@example.com" },
        { id: "2", email: "user2@example.com" },
        { id: "3", email: "user3@example.com" },
      ] as unknown as NewsLetterSubscriber[];
      const mockTotal = 50;

      newsLetterRepositoryMock.findAndCount.mockResolvedValue([
        mockSubscribers,
        mockTotal,
      ]);

      const result = await newsLetterSubscriptionService.fetchAllNewsletter({
        page,
        limit,
      });

      expect(result).toEqual({
        data: mockSubscribers,
        meta: {
          total: mockTotal,
          page,
          limit,
          totalPages: Math.ceil(mockTotal / limit),
        },
      });
      expect(newsLetterRepositoryMock.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
      });
    });

    it("should handle default pagination values", async () => {
      const mockSubscribers: any = [
        { id: "1", email: "user1@example.com" },
        { id: "2", email: "user2@example.com" },
      ];
      const mockTotal = 20;

      newsLetterRepositoryMock.findAndCount.mockResolvedValue([
        mockSubscribers,
        mockTotal,
      ]);

      const result = await newsLetterSubscriptionService.fetchAllNewsletter({});

      expect(result).toEqual({
        data: mockSubscribers,
        meta: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: 2,
        },
      });
      expect(newsLetterRepositoryMock.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });
});
