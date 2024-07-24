// @ts-nocheck
import { AdminUserService } from "../services"; // Adjust the import path as necessary
import { User } from "../models"; // Adjust the import path as necessary
import AppDataSource from "../data-source"; // Adjust the import path as necessary
import { Repository } from "typeorm";

describe("AdminUserService", () => {
  let adminUserService: AdminUserService;
  let userRepository: Repository<User>;
  let consoleErrorMock: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    adminUserService = new AdminUserService();
    userRepository = AppDataSource.getRepository(User);
  });

  afterAll(async () => {
    consoleErrorMock.mockRestore();
  });

  it("should return paginated users", async () => {
    const mockUsers = [
      { id: 1, name: "User1" },
      { id: 2, name: "User2" },
      { id: 3, name: "User3" },
      { id: 4, name: "User5" },
      { id: 5, name: "User6" },
      { id: 6, name: "User6" },
    ] as unknown as User[];

    const findAndCount = jest
      .spyOn(userRepository, "findAndCount")
      .mockResolvedValue([mockUsers, 10]);

    const page = 1;
    const limit = 2;

    const users = await adminUserService.getPaginatedUsers(page, limit);

    expect(findAndCount).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });

    expect(users).toEqual({ users: mockUsers, totalUsers: 10 });
  });

  it("should return empty array when no users are found", async () => {
    const findAndCountSpy = jest
      .spyOn(userRepository, "findAndCount")
      .mockResolvedValue([[], 0]);

    const page = 1;
    const limit = 2;

    const noUser = await adminUserService.getPaginatedUsers(page, limit);

    expect(findAndCountSpy).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });

    expect(noUser).toEqual({ users: [], totalUsers: 0 });
  });
});
