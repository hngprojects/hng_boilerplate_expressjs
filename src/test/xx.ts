import { Repository } from "typeorm";
import { AuthService } from "../services/authservice";
import AppDataSource from "../data-source";
import { User, Profile } from "../models";
import * as utils from "../utils";

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
}));

describe("AuthService - googleSignin", () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let profilesRepository: Repository<Profile>;

  beforeEach(() => {
    usersRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as Repository<User>;

    profilesRepository = {
      save: jest.fn(),
    } as unknown as Repository<Profile>;

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return usersRepository;
      if (entity === Profile) return profilesRepository;
    });

    authService = new AuthService();
    // Assuming AuthService constructor initializes these repositories
    (authService as any).usersRepository = usersRepository;
    (authService as any).profilesRepository = profilesRepository;
  });

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

    (usersRepository.findOne as jest.Mock).mockResolvedValue(existingUser);

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
    expect(usersRepository.save).not.toHaveBeenCalled();
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

    (usersRepository.findOne as jest.Mock).mockResolvedValue(null);
    (profilesRepository.save as jest.Mock).mockResolvedValue(newProfile);
    (usersRepository.save as jest.Mock).mockImplementation((user) => {
      user.id = "456"; // Ensure the user has an id
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
    expect(usersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        google_id: "google-id",
        email: "newuser@example.com",
        first_name: "Jane",
        last_name: "Smith",
        is_verified: true,
      }),
    );
    expect(profilesRepository.save).toHaveBeenCalledWith(
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

    (usersRepository.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(authService.googleSignin(payload)).rejects.toThrow(
      "Database error",
    );
  });
});
