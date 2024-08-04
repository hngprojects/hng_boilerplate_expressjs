import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";
import { User } from "../models";
import { AuthService } from "../services/authservice";
import { generateToken, verifyToken } from "../utils";
import { addEmailToQueue } from "../utils/queue";

jest.mock("../data-source", () => ({
  __esModule: true,
  default: {
    getRepository: jest.fn(),
    initialize: jest.fn(),
    isInitialized: false,
  },
}));

jest.mock("../models");
jest.mock("../utils");
jest.mock("../utils/mail");
jest.mock("../utils/queue");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
    } as any;
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return userRepositoryMock;
    });

    authService = new AuthService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("magicLink auth", () => {
    it("should throw ResourceNotFound for non-existent user", async () => {
      const payload = {
        email: "nonexistent@example.com",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.generateMagicLink(payload.email),
      ).rejects.toThrow(ResourceNotFound);

      await expect(
        authService.generateMagicLink(payload.email),
      ).rejects.toThrow("User is not registered");

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: payload.email },
      });
    });

    it("should generate magic link for existing user", async () => {
      const payload = {
        email: "existing@example.com",
      };

      const mockUser = { id: "1", email: payload.email };
      const token = "a-authtoken";
      const mailSent = "Email sent.";

      // Mock successful responses
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateToken as unknown as jest.Mock).mockReturnValue(token);
      (addEmailToQueue as jest.Mock).mockResolvedValue(mailSent);

      const result = await authService.generateMagicLink(payload.email);

      expect(result).toEqual({
        ok: true,
        message: "Sign-in token sent to email.",
        user: mockUser,
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: payload.email },
      });
      expect(generateToken).toHaveBeenCalledWith({ email: payload.email });
      expect(addEmailToQueue).toHaveBeenCalled();
    });

    it("should validate the token and return user information", async () => {
      const token = "valid-token";
      const email = "test@example.com";
      const mockUser = { id: "1", email };

      (verifyToken as jest.Mock).mockReturnValue({ email });
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateMagicLinkToken(token);

      expect(result).toEqual({
        status: "ok",
        email: mockUser.email,
        userId: mockUser.id,
      });
    });

    it("should throw an error for invalid token", async () => {
      const token = "invalid-token";
      (verifyToken as jest.Mock).mockReturnValue({});

      await expect(authService.validateMagicLinkToken(token)).rejects.toThrow(
        "Invalid JWT",
      );
    });

    it("should generate an access token for a valid user ID", async () => {
      const userId = "1";
      const mockAccessToken = "mock-access-token";

      (generateToken as unknown as jest.Mock).mockResolvedValue(
        mockAccessToken,
      );

      const result = await authService.passwordlessLogin(userId);

      expect(result).toEqual({ access_token: mockAccessToken });
    });
  });
});
