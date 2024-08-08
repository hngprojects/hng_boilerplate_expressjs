import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { NewsLetterSubscriber } from "../models/newsLetterSubscription";
import { NewsLetterSubscriptionService } from "../services/newsLetterSubscription.service";
import { ResourceNotFound, BadRequest, Unauthorized } from "../middleware";
import { adminOnly } from "../middleware/checkUserRole";


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

    it("should handle already subscribed user", async () => {
      const user = new NewsLetterSubscriber();
      user.id = "123";
      user.email = "test@example.com";
      user.isSubscribe = true;
      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(user);
      (newsLetterRepositoryMock.save as jest.Mock).mockImplementation(
        (user) => {
          user.id = "456";
          return Promise.resolve(user);
        },
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

jest.mock("../middleware/checkUserRole.ts", () => ({
  ...jest.requireActual("../middleware/checkUserRole.ts"),
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
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();

    (adminOnly as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { role: "USER" };
      next(new Unauthorized("Access denied. Admins only."));
    });

    await adminOnly(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Unauthorized("Access denied. Admins only."));
  });

  it("should allow access to admin users", async () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();

    (adminOnly as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { role: "ADMIN" };
      next();
    });

    await adminOnly(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
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

  describe("UnsubscribeFromNewsLetter", () => {
    it("should successfully unsubscribe a logged-in user from the newsletter", async () => {
      const user = new NewsLetterSubscriber();
      user.email = "test1@example.com";
      user.id = "5678";
      user.isSubscribe = true;

      (newsLetterRepositoryMock.findOne as jest.Mock).mockResolvedValue(user);

      (newsLetterRepositoryMock.save as jest.Mock).mockImplementation(
        (user) => {
          user.isSubscribe = false;
          return Promise.resolve(user);
        },
      );

      const result =
        await newsLetterSubscriptionService.unSubcribeUser("test1@example.com");

      expect(result).toEqual({
        id: "5678",
        email: "test1@example.com",
        isSubscribe: false,
      });

      expect(newsLetterRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "5678",
          email: "test1@example.com",
          isSubscribe: false,
        }),
      );
    });

    it("should throw an error if user isn't  subscribed", async () => {
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
  });
});
