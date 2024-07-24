// @ts-nocheck

import { UserService } from "../services";
import { User } from "../models";
import { Repository } from 'typeorm';
import AppDataSource from "../data-source";
import { HttpError } from "../middleware";

jest.mock('../data-source', () => ({
  getRepository: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      getPaginatedUsers:jest.fn(),
      ...jest.requireActual('typeorm').Repository.prototype,
    } as jest.Mocked<Repository<User>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(userRepositoryMock);
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('softDeleteUser', () => {
    it('should soft delete a user', async () => {
      const user: User = { id: '123', is_deleted: false } as User;
      userRepositoryMock.findOne.mockResolvedValue(user);
      userRepositoryMock.softDelete.mockResolvedValue({ affected: 1 } as any);

      const result = await userService.softDeleteUser('123');

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(userRepositoryMock.save).toHaveBeenCalledWith({ ...user, is_deleted: true });
      expect(userRepositoryMock.softDelete).toHaveBeenCalledWith({ id: '123' });
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw a 404 error if user not found', async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(userService.softDeleteUser('123')).rejects.toThrow(new HttpError(404, "User Not Found"));

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
      expect(userRepositoryMock.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('getPaginatedUsers', () => {
    it('should return paginated users', async () => {
      const users: User[] = [
        { id: '123', name: 'John Doe', is_deleted: false } as User,
        { id: '124', name: 'Jane Doe', is_deleted: false } as User,
      ];
      const totalUsers = 2;

      userRepositoryMock.find.mockResolvedValue(users);
      userRepositoryMock.count.mockResolvedValue(totalUsers);

      const result = await userService.getPaginatedUsers(1, 2, 0);

      expect(userRepositoryMock.find).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
      });
      expect(result).toEqual(users);
    });

    it('should throw an error if page is less than 1', async () => {
      await expect(userService.getPaginatedUsers(0, 10)).rejects.toThrow("Page number must be greater than 0.");
    });

    it('should throw an error if limit is less than 1', async () => {
      await expect(userService.getPaginatedUsers(1, 0)).rejects.toThrow("Limit must be greater than 0.");
    });

    
    it('should return an empty array if offset is out of range', async () => {
      const totalUsers = 5;

      userRepositoryMock.count.mockResolvedValue(totalUsers);

      const result = await userService.getPaginatedUsers(1, 10);

      expect(result).toEqual([]);
    });

    it('should adjust the limit if it exceeds the remaining users', async () => {
      const users: User[] = [
        { id: '123', name: 'John Doe', is_deleted: false } as User,
        { id: '124', name: 'Jane Doe', is_deleted: false } as User,
      ];
      const totalUsers = 4;

      userRepositoryMock.find.mockResolvedValue(users);
      userRepositoryMock.count.mockResolvedValue(totalUsers);

      const result = await userService.getPaginatedUsers(1, 10);

      expect(userRepositoryMock.find).toHaveBeenCalledWith({
        skip: 3,
        take: 1,
      });
      expect(result).toEqual(users);
    });
  });
});
