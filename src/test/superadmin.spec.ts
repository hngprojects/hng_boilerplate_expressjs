// @ts-nocheck
import { Request } from "express";
import { User } from "../models/user"; // Ensure this matches the actual file casing
import AppDataSource from "../data-source";
import { AdminUserService } from "../services/admin.services";
import { HttpError } from "../middleware";
import { hashPassword } from "../utils/index";

jest.mock("../data-source");
jest.mock("../utils/index");

describe("AdminUserService", () => {
  let adminUserService: AdminUserService;
  let consoleErrorMock: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  beforeEach(() => {
    adminUserService = new AdminUserService();
  });

  describe("updateUser", () => {
    it("should update the user successfully", async () => {
      const req = {
        body: {
          firstName: "New",
          lastName: "Name",
          email: "existinguser@example.com",
          role: "admin",
          password: "newPassword",
          isverified: true,
        },
        params: { id: "1" },
      } as unknown as Request;

      const mockUser = {
        id: "1",
        name: "Existing User",
        email: "existinguser@example.com",
        password: "oldPasswordHash",
        isverified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const updatedFields = {
        name: "New Name",
        email: "existinguser@example.com",
        role: "admin",
        password: "newPasswordHash",
        isverified: true,
      };

      const mockUpdatedUser = {
        ...mockUser,
        ...updatedFields,
        updatedAt: new Date(),
      };

      const userRepository = {
        findOne: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockImplementation((id, fields) => {
          Object.assign(mockUser, fields);
          return Promise.resolve();
        }),
        findOneBy: jest.fn().mockResolvedValue(mockUpdatedUser),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(
        userRepository,
      );
      (hashPassword as jest.Mock).mockResolvedValue("newPasswordHash");

      const result = await adminUserService.updateUser(req);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: "existinguser@example.com" },
      });
      expect(userRepository.update).toHaveBeenCalledWith("1", {
        name: "New Name",
        email: "existinguser@example.com",
        role: "admin",
        password: "newPasswordHash",
        isverified: true,
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it("should throw a 404 error if user is not found", async () => {
      const req = {
        body: {
          firstName: "New",
          lastName: "Name",
          email: "nonexistentuser@example.com",
          role: "admin",
          password: "newPassword",
          isverified: true,
        },
        params: { id: "1" },
      } as unknown as Request;

      const userRepository = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(
        userRepository,
      );

      await expect(adminUserService.updateUser(req)).rejects.toThrow(HttpError);
      await expect(adminUserService.updateUser(req)).rejects.toThrow(
        "User not found",
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: "nonexistentuser@example.com" },
      });
    });

    it("should throw an error if hashing the password fails", async () => {
      const req = {
        body: {
          firstName: "New",
          lastName: "Name",
          email: "existinguser@example.com",
          role: "admin",
          password: "newPassword",
          isverified: true,
        },
        params: { id: "1" },
      } as unknown as Request;

      const mockUser = {
        id: "1",
        name: "Existing User",
        email: "existinguser@example.com",
        password: "oldPasswordHash",
        isverified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const userRepository = {
        findOne: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn(),
      };

      (AppDataSource.getRepository as jest.Mock).mockReturnValue(
        userRepository,
      );
      (hashPassword as jest.Mock).mockRejectedValue(
        new Error("Hashing failed"),
      );

      await expect(adminUserService.updateUser(req)).rejects.toThrow(
        "Hashing failed",
      );
    });
  });
});
