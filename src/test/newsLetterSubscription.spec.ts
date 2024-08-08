import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";
import { adminOnly, Unauthorized } from "../middleware";

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

jest.mock("../middleware", () => ({
  ...jest.requireActual("../middleware"),
  adminOnly: jest.fn(),
}));

describe("RestoreNewsLetterSubscription", () => {
  it("should restore a valid deleted subscription", async () => {
    const subscription = new NewsLetterSubscriber();
    subscription.id = "123";
    subscription.email = "test@example.com";
    subscription.isActive = false;

    (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(subscription);
    (newsLetterRepositoryMock.save as jest.Mock).mockImplementation(
      (subscription) => {
        subscription.isActive = true;
        return Promise.resolve(subscription);
      },
    );

    const result =
      await newsLetterSubscriptionService.restoreSubscription("123");

    expect(result).toEqual({
      id: "123",
      email: "test@example.com",
      isActive: true,
    });
    expect(newsLetterRepositoryMock.save).toHaveBeenCalledWith(subscription);
  });

  it("should return null if the subscription is not found", async () => {
    (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      newsLetterSubscriptionService.restoreSubscription("123")
    ).rejects.toThrow("Subscription not found");

    expect(newsLetterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("should return null if the subscription is already active", async () => {
    const subscription = new NewsLetterSubscriber();
    subscription.id = "123";
    subscription.email = "test@example.com";
    subscription.isActive = true;

    (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(subscription);

    await expect(
      newsLetterSubscriptionService.restoreSubscription("123")
    ).rejects.toThrow("Subscription not found");

    expect(newsLetterRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("should throw an error if something goes wrong", async () => {
    (newsLetterRepositoryMock.findOne as jest.Mock).mockRejectedValue(
      new Error("An error occurred while processing your request"),
    );

    await expect(
      newsLetterSubscriptionService.restoreSubscription("123"),
    ).rejects.toThrow("An error occurred while processing your request");
  });

  it("should deny access to non-admin users", async () => {
    const mockReq = {} as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();

    (adminOnly as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { role: "USER" };
      next();
    });

    await adminOnly(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Unauthorized("Access denied. Admins only."));
  });

  it("should allow access to admin users", async () => {
    const mockReq = {} as any;
    const mockRes = {} as any;
    const mockNext = jest.fn();

    (adminOnly as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { role: "ADMIN" };
      next();
    });

    await adminOnly(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
});
