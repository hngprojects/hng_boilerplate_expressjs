// @ts-nocheck

import { User } from "../models/user";
import AppDataSource from "../data-source";
import { AdminUserService } from "../services/admin.services";
import { HttpError } from "../middleware";

jest.mock("../data-source");

describe("AdminUserService - getSingleUser", () => {
  let adminUserService: AdminUserService;

  beforeEach(() => {
    adminUserService = new AdminUserService();
  });

  it("should return a user when found", async () => {
    const mockUser = {
      id: "1",
      profile: {
        first_name: "Precious",
        last_name: "Ifeaka",
        phone_number: "1234567890",
        avatarUrl: "http://example.com/avatar.jpg",
      },
      email: "ifeakaa@example.com",
      role: "user",
    } as User;

    const userRepository = {
      findOne: jest.fn().mockResolvedValue(mockUser),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepository);

    const result = await adminUserService.getSingleUser("1");

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });

  it("should throw a 404 error if user is not found", async () => {
    const userRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepository);

    await expect(adminUserService.getSingleUser("1")).rejects.toThrow(
      HttpError,
    );
    await expect(adminUserService.getSingleUser("1")).rejects.toThrow(
      "User not found",
    );
  });

  it("should handle internal server error", async () => {
    const userRepository = {
      findOne: jest.fn().mockImplementation(() => {
        throw new Error("Internal server error");
      }),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepository);

    await expect(adminUserService.getSingleUser("1")).rejects.toThrow(
      HttpError,
    );
    await expect(adminUserService.getSingleUser("1")).rejects.toThrow(
      "Internal server error",
    );
  });

  it("should handle any other error", async () => {
    const userRepository = {
      findOne: jest.fn().mockImplementation(() => {
        throw new Error("Unexpected error");
      }),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepository);

    await expect(adminUserService.getSingleUser("1")).rejects.toThrow(
      HttpError,
    );
    await expect(adminUserService.getSingleUser("1")).rejects.toThrow(
      "Unexpected error",
    );
  });
});
