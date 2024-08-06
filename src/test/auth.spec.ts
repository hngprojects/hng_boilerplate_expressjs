import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { ResourceNotFound } from "../middleware";
import { Profile, User } from "../models";
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

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  getIsInvalidMessage: jest.fn(() => "Mocked invalid message"),
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
}));

jest.mock("../models");
jest.mock("../utils");
jest.mock("../utils/mail");
jest.mock("../utils/queue");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;
  let profilesRepositoryMock: Repository<Profile>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    profilesRepositoryMock = {
      save: jest.fn(),
    } as unknown as Repository<Profile>;

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return userRepositoryMock;
      if (entity === Profile) return profilesRepositoryMock;
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

  describe("Google Auth", () => {
    it("should sign in an existing user", async () => {
      const existingUser = new User();
      existingUser.id = "123";
      existingUser.email = "test@example.com";
      existingUser.first_name = "John";
      existingUser.last_name = "Doe";

      const payload = {
        sub: "google-id",
        email: "test@example.com",
        given_name: "John",
        family_name: "Doe",
        picture: "http://example.com/pic.jpg",
        email_verified: true,
      };

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(existingUser);

      const result = await authService.googleSignin(payload);

      expect(result.is_new_user).toBe(false);
      expect(result.userInfo).toEqual({
        id: "123",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        fullname: "John Doe",
        role: "",
      });
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it("should sign in a new user", async () => {
      const payload = {
        sub: "google-id",
        email: "newuser@example.com",
        given_name: "Jane",
        family_name: "Smith",
        picture: "http://example.com/pic.jpg",
        email_verified: true,
      };

      const newUser = new User();
      newUser.email = "newuser@example.com";
      newUser.first_name = "Jane";
      newUser.last_name = "Smith";
      newUser.google_id = "google-id";
      newUser.is_verified = true;

      const newProfile = new Profile();
      newProfile.email = "newuser@example.com";
      newProfile.profile_pic_url = "http://example.com/pic.jpg";

      (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      (profilesRepositoryMock.save as jest.Mock).mockResolvedValue(newProfile);
      (userRepositoryMock.save as jest.Mock).mockImplementation((user) => {
        user.id = "456";
        return Promise.resolve(user);
      });

      const result = await authService.googleSignin(payload);

      expect(result.is_new_user).toBe(true);
      expect(result.userInfo).toEqual({
        id: "456",
        email: "newuser@example.com",
        first_name: "Jane",
        last_name: "Smith",
        fullname: "Jane Smith",
        role: "",
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          google_id: "google-id",
          email: "newuser@example.com",
          first_name: "Jane",
          last_name: "Smith",
          is_verified: true,
        }),
      );
      expect(profilesRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "newuser@example.com",
          profile_pic_url: "http://example.com/pic.jpg",
        }),
      );
    });

    it("should throw an error if something goes wrong", async () => {
      const payload = {
        sub: "google-id",
        email: "erroruser@example.com",
        given_name: "Error",
        family_name: "User",
        picture: "http://example.com/pic.jpg",
        email_verified: true,
      };

      (userRepositoryMock.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(authService.googleSignin(payload)).rejects.toThrow(
        "Database error",
      );
    });
  });
});
