// @ts-nocheck

import { UserService } from "../services";
import { User, Profile } from "../models";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";
import { cloudinary } from "../config/multer";

jest.mock("../data-source", () => ({
  getRepository: jest.fn(),
}));

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe("UserService", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      ...jest.requireActual("typeorm").Repository.prototype,
    } as jest.Mocked<Repository<User>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepositoryMock);
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("softDeleteUser", () => {
    it("should soft delete a user", async () => {
      const user: User = { id: "123", is_deleted: false } as User;
      userRepositoryMock.findOne.mockResolvedValue(user);
      userRepositoryMock.softDelete.mockResolvedValue({ affected: 1 } as any);

      const result = await userService.softDeleteUser("123");

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(userRepositoryMock.save).toHaveBeenCalledWith({ ...user, is_deleted: true });
      expect(userRepositoryMock.softDelete).toHaveBeenCalledWith({ id: "123" });
      expect(result).toEqual({ affected: 1 });
    });

    it("should throw a 404 error if user not found", async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(userService.softDeleteUser("123")).rejects.toThrow(new HttpError(404, "User Not Found"));

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
      expect(userRepositoryMock.softDelete).not.toHaveBeenCalled();
    });
  });
});

jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("UserService - updateUserProfile", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;
  let profileRepositoryMock: jest.Mocked<Repository<Profile>>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<Repository<User>>;
    profileRepositoryMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<Repository<Profile>>;
    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce(userRepositoryMock)
      .mockReturnValueOnce(profileRepositoryMock);
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user profile and avatar", async () => {
    const id = "1";
    const payload = {
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      avatarUrl: "new/path/to/avatar.jpg",
    };
    const file = { path: "new/path/to/avatar.jpg" } as Express.Multer.File;

    const user = {
      id,
      name: "John Doe",
      profile: { id: "1", avatarUrl: "old/path/to/avatar.jpg" },
    };
    const profile = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      avatarUrl: "old/path/to/avatar.jpg",
    };
    const updatedProfile = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      avatarUrl: "new/path/to/avatar.jpg",
    };

    const updateDetails = {
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      avatarUrl: "new/path/to/avatar.jpg",
    };

    userRepositoryMock.findOne.mockResolvedValue(user);
    profileRepositoryMock.findOne.mockResolvedValue(profile);
    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: "new/path/to/avatar.jpg",
    });

    profileRepositoryMock.update.mockResolvedValue(updatedProfile);
    userRepositoryMock.update.mockResolvedValue(user);
    userRepositoryMock.findOne.mockResolvedValue({
      ...user,
      profile: { ...profile, ...updatedProfile },
      name: `${updatedProfile.first_name} ${updatedProfile.last_name}`,
    });

    const result = await userService.updateUserProfile(id, payload, file);

    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(2);
    expect(profileRepositoryMock.findOne).toHaveBeenCalledTimes(2);
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("avatar");
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(file.path);
    expect(profileRepositoryMock.update).toHaveBeenCalledWith(profile.id, updateDetails);
    expect(userRepositoryMock.update).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      ...user,
      profile: { ...profile, ...updatedProfile },
      name: `${updatedProfile.first_name} ${updatedProfile.last_name}`,
    });
  });

  it("should throw error if user not found", async () => {
    const id = "1";
    const payload = {
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
    };

    userRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(userService.updateUserProfile(id, payload)).rejects.toThrow(new HttpError(404, "User not found"));
  });

  it("should throw error if profile not found", async () => {
    const id = "1";
    const payload = {
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
    };

    const user = {
      id,
      profile: { id: "1", avatarUrl: "old/path/to/avatar.jpg" },
    };

    userRepositoryMock.findOne.mockResolvedValue(user);
    profileRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(userService.updateUserProfile(id, payload)).rejects.toThrow(new HttpError(404, "Profile not found"));
  });
});
