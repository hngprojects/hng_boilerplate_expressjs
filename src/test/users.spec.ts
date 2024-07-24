// @ts-nocheck

import { UserService } from "../services";
import { User } from "../models";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";

jest.mock("../data-source", () => ({
  getRepository: jest.fn(),
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